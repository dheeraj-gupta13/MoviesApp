import React, { Component } from 'react'
import axios from 'axios'

export default class Movies extends Component {

    constructor(){
        super();
        this.state = {
            hover:'',
            parr:[1],
            currPage:1,
            movies: [], // Array of all movies Objects
            favourites:[],
        }
    }

    async componentDidMount(){
        let res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=51a9a0f3eb24b743e4c4aa919f4921b8&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        this.setState({
            movies:[...data.results],
        })
    }

    handlePageChange = async () => {
        let res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=51a9a0f3eb24b743e4c4aa919f4921b8&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        this.setState({
            movies:[...data.results],
        })
    }

    handleRight = () => {
        let tempArr = [];
        for(let i = 1; i <= this.state.parr.length+1; i++){
            tempArr.push(i);
        }
        this.setState({
            parr : [...tempArr],
            currPage: this.state.currPage + 1,
        }, this.handlePageChange);
    }

    handleLeft = () => {
        if(this.state.currPage >= 2){
            this.setState({
                currPage:this.state.currPage-1,
            }, this.handlePageChange)
        }
    }

    handleMid = (value) =>{
        if(value != this.state.currPage){
            this.setState({
                currPage: value
            },this.handlePageChange);
        }
    }

    handleFavourites = (movieObj) => {
        let oldData = JSON.parse(localStorage.getItem('movies') || "[]");

        if(this.state.favourites.includes(movieObj.id)){
            oldData = oldData.filter((movie) => 
                (movieObj.id !== movie.id)
            );
        }
        else{
            oldData.push(movieObj);
        }

        localStorage.setItem("movies", JSON.stringify(oldData));
        this.handleFavouritesState();
    }

    handleFavouritesState = () => {
        let oldData = JSON.parse(localStorage.getItem('movies') || "[]");
        let temp = oldData.map((movie)=> movie.id);
        this.setState({
            favourites:[...temp],
        })
    }


    render() {
        let movie = this.state.movies;
        return (
            <>
            {
                movie.length === 0 ?
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Lawding...</span>
                    </div> 
                    :
                    <div>
                        <h2 className="text-center"><strong>Trending</strong></h2>
                        <div className="movies-wrapper">
                            {
                                movie.map((movieObj) => (
                                    <div className="card single-movie-card" key={movieObj.original_title} onMouseEnter={() => this.setState({hover:movieObj.id})}  onMouseLeave={()=>this.setState({hover:''})}>
                                        <img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`}  alt={movieObj.title} className="card-img-top  single-movie-img"/>
                                        <h5 className="card-title single-movie-title">{movieObj.original_title}</h5>
                                        {
                                            this.state.hover === movieObj.id  &&
                                            <a className="btn btn-primary single-movie-button" onClick={() => this.handleFavourites(movieObj)}> {this.state.favourites.includes(movieObj.id) ? "Remove from favourites" : "Add to favourites"}</a>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>

            }

            <div className='pagination-cont'>
                <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item"><a className="page-link" onClick={this.handleLeft}>Previous</a></li>
                    {
                        this.state.parr.map((value)=>(
                            <li className="page-item"><a className="page-link" onClick={() => this.handleMid(value)}>{value}</a></li>
                        ))
                    }   
                    <li className="page-item"><a className="page-link" onClick={this.handleRight}>Next</a></li>
                </ul>
                </nav>
            </div>
            </>
        )
    }
}
