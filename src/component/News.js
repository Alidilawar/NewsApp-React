import React, { useState, useEffect } from 'react'
import NewsItems from './NewsItems'
import Spinnerr from './Spinnerr'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
      
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0)
    
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    

    const updateNews = async() => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsApp`
        updateNews();        
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    /*handlePrevButton = async () => {
        // console.log("Previous");
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=10480aa2e6114eeb8ca4bfdf8f73cd02&page=${this.state.page - 1}&pageSize=${props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            page: this.state.page - 1,
            articles: parsedData.articles,
            loading: false
        })
    }*/

    /*handleNextButton = async () => {
        // console.log("Next");
        if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize))) {
            let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=10480aa2e6114eeb8ca4bfdf8f73cd02&page=${this.state.page + 1}&pageSize=${props.pageSize}`;
            this.setState({ loading: true });
            let data = await fetch(url);
            let parsedData = await data.json();
            this.setState({
                page: this.state.page + 1,
                articles: parsedData.articles,
                loading: false
            })
        }
    }*/

     const fetchMoreData = async () => {                
         const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=10480aa2e6114eeb8ca4bfdf8f73cd02&page=${page+1}&pageSize=${props.pageSize}`;
         setPage(page+1)
          let data = await fetch(url);
          let parsedData = await data.json();
          setArticles(articles.concat(parsedData.articles));
          setTotalResults(parsedData.totalResults);
               
      };
            
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '70px' }}>NewsApp - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinnerr/>}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinnerr/>}
                >
                <div className="container">
                
                <div className="row">
                {articles.map((element) => {
                    return <div className="col-md-4" key={element.url}>
                    <NewsItems title={element.title?element.title: ""} description={element.description?element.description: ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                    </div>
                })}
                </div>
                </div>
                </InfiniteScroll>               
            </>
        )

    }
    News.defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    }

    News.propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
 

export default News
