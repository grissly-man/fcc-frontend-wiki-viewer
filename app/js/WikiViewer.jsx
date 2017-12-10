import React, {Component} from 'react';
import ResultsBox from './ResultsBox';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '../assets/WikiViewer.css';

class WikiViewer extends Component {
    constructor(props) {
        super(props);
        
        this.makeWikiQuery = this.makeWikiQuery.bind(this);
        this.getNextPage = this.getNextPage.bind(this);
        //this.getRandomWikiPage = this.getRandomWikiPage.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
        
        this.state = {
            results: {},
            query: "",
            lastQuery: null,
            updating: false,
        };
    }
    
    makeWikiQuery(offset, query) {
        if (!query && this.state.query === "") return;
        
        var wikiViewer = this;
        var apiURI = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srlimit=10&srprop=snippet&origin=*";
        apiURI += `&srsearch=${query || this.state.query}&sroffset=${offset || 0}`;
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                var json = JSON.parse(req.responseText);  // our API sends a string which needs to be parsed
                
                // handle scrolling:
                var resultsBox = document.getElementById('results-box');
                var topPos = resultsBox.offsetTop;
                document.getElementById('results-box').scrollTop = 0;

                return wikiViewer.setState({
                    lastQuery: query || wikiViewer.state.query,
                    query: "",
                    results: json,
                    updating: false
                });
            }
        };
        
        req.open("GET", apiURI);
        req.send();
    }
    
    // request more results from wikipedia (pagination)
    getNextPage() {
        if (!this.state.results.query || !this.state.lastQuery || !this.state.results.continue) return;
        
        this.setState({
            updating: true
        });
        
        this.makeWikiQuery(this.state.results.continue.sroffset, this.state.lastQuery);
    }
    
    // bind our form element to the state
    handleQueryChange(e) {
        e.preventDefault();
        return this.setState({
            query: e.target.value
        });
    }
    
    // wrapper for query form action - prevents default and makes quert
    handleQuerySubmit(e) {
        e.preventDefault();
        return this.makeWikiQuery();
    }
    
    getRandomWikiPage() {
        return window.open("https://en.wikipedia.org/wiki/Special:Random");
    }
    
    render() {
        var styles = {
            'wikiviewer-outer': {
                position: 'absolute',
                left: 10, right: 10,
                top: 10, bottom: 30,
                margin: this.state.results.query ? '0 auto' : 'auto',
                padding: 0,
                minWidth: '250px',
                maxWidth: '800px',
                height: this.state.results.query ? null : '80px',
            },
            'wikiviewer-query-box': {
                position: 'absolute',
                top: 0,
                height: '80px',
                width: '100%',
            },
            'query-box': {
                position: 'absolute',
                left: 0,
                width: 'calc(100% - 100px)',
                height: '40px',
                padding: '0 10',
                fontSize: '14pt',
                border: '1px solid #eee',
                borderRadius: '20px 0 0 0',
                outline: 'none'
            },
            'query-submit': {
                position: 'absolute',
                right: '0',
                width: '100px',
                height: '40px',
                fontSize: '14pt',
                borderRadius: '0 20px 0 0',
                border: '1px solid #eee',
                borderLeft: '0px',
                color: 'white',
                backgroundColor: '#337ab7',
                outline: "none"
            },
            'query-box-random': {
                position: 'absolute',
                top: '40px',
                width: '100%',
                height: '40px',
                fontSize: '14pt',
                borderRadius: '0 0 20px 20px',
                border: '1px solid #eee',
                borderTop: '0px',
                color: 'white',
                backgroundColor: '#5bc0de',
                outline: "none"
            }
        };
        
        return <div id="wikiviewer" style={styles['wikiviewer-outer']}>
            <div style={styles['wikiviewer-query-box']}>
                <form onSubmit={this.handleQuerySubmit}>
                    <input type="text" style={styles['query-box']} placeholder="Search wikipedia" onChange={this.handleQueryChange} value={this.state.query} autoFocus /><input style={styles['query-submit']} type="submit" value="Search" />
                </form>
                <button style={styles['query-box-random']} onClick={this.getRandomWikiPage}>Or get a random page</button>
            </div>
            <ReactCSSTransitionGroup transitionName="transition-results" transitionAppear={true} transitionAppearTimeout={300} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                <ResultsBox key={this.state.results.query && this.state.results.continue ? this.state.lastQuery + this.state.results.continue.sroffset : ""} getNextPage={this.getNextPage} results={this.state.results} updating={this.state.updating} />
            </ReactCSSTransitionGroup>
        </div>;
    }
}

export default WikiViewer;