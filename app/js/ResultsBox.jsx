import React, {Component} from 'react';
import sanitize from 'sanitize-html';

class Result extends Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        
        this.state = {
            hover: false
        }
    }
    
    handleClick() {
        var href = "https://en.wikipedia.org/wiki/";
        href += encodeURIComponent(this.props.data.title);
        window.open(href);
    }
    
    handleMouseOver(e) {
        return this.setState({
            hover: true
        });
    }
    
    handleMouseOut(e) {
        return this.setState({
            hover: false
        });
    }
    
    render() {
        var styles = {
            'result-main': {
                color: this.state.hover ? "#fff" : "#000",
                textAlign: 'left',
                backgroundColor: this.state.hover ? "#5bc0de" : "#fff",
                margin: '0 10 10 10',
                border: 0,
                borderLeft: '5px solid #eee',
                outline: 'none'
            },
            'result-inner': {
                margin: 10
            },
            'result-item-title': {
                fontSize: '14pt',
                fontWeight: 'bold',
                marginBottom: '10pt'
            },
            'result-item-snippet': {
                color: this.state.hover ? "#fff" : "#ccc",
                fontSize: '12pt',
                fontStyle: 'italic'
            }
        };
        
        return <button style={styles['result-main']} onClick={this.handleClick} onMouseUp={this.handleMouseOut} onTouchStart={this.handleMouseOver} onTouchEnd={this.handleMouseOut} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
            <div style={styles['result-inner']}>
                <div style={styles['result-item-title']}>{this.props.data.title}</div>
                <div style={styles['result-item-snippet']} dangerouslySetInnerHTML={{__html: sanitize(this.props.data.snippet)}}></div>
            </div>
        </button>;
    }
}

class ResultsBox extends Component {
    render() {
        var styles = {
            'results-box-outer': {
                position: 'absolute',
                top: 90, bottom: 0,
                overflowX: 'hidden',
                overflowY: 'auto'
            },
            'results-box-next-page': {
                width: '100%',
                height: '40px',
                fontSize: '14pt',
                borderRadius: '20px',
                border: this.props.updating ? '1px solid #eee' : '1px solid #ccc',
                color: this.props.updating ? "#ccc" : '#333',
                backgroundColor: '#fff',
                outline: "none"
            }
        };
        
        var results = this.props.results.query && this.props.results.query.search && this.props.results.query.search.length > 0 ? this.props.results.query.search.map(function(result, key) {
            return <Result key={key} data={result} />;
        }) : <div key="none-found">None found</div>;
        
        return <div style={styles['results-box-outer']} id="results-box">
            {results}
            { this.props.results.continue ? <button style={styles['results-box-next-page']} disabled={this.props.updating} onClick={this.props.getNextPage}>
                {this.props.updating ? "Updating..." : "More..." }
            </button> : null }
        </div>;
    }
}

export default ResultsBox;