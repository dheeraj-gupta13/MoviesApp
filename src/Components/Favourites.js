import React, { Component } from 'react'

export default class Favourites extends Component {

    constructor(){
        super();
        this.state = {
            generes:[],
            currGen: "All genres",
            movies:[],
            currText:'',
            currPage: 1,
            limit: 5,
        }
    }

    componentDidMount(){
        let genreids = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',37:'Western'};

        let data = JSON.parse(localStorage.getItem("movies") || "[]");

        let temp = []; 

        data.forEach((movieObj) => {
            if(temp.includes(genreids[movieObj.genre_ids[0]]) == false) {
                temp.push(genreids[movieObj.genre_ids[0]]);
            }
        });
        temp.unshift("All genres");

        this.setState({
            generes:[...temp],
            movies:[...data]
        })

        console.log(this.state.movies);
    }

    handleGenre = (genre) =>{
        this.setState({
            currGen: genre,
        })
    }

    handleSortDesc = () => {
        let temp = this.state.movies;

        temp.sort(function(objA, objB){
            return objB.popularity - objA.popularity;
        });

        this.setState({
            movies : [...temp],
        })
    }

    handleSortAsc = () => {
        let temp = this.state.movies;

        temp.sort(function(objA, objB){
            return objA.popularity - objB.popularity;
        });

        this.setState({
            movies : [...temp],
        })
    }

    handleRatingDesc = () => {
        let temp = this.state.movies;
        temp.sort(function(objA, objB){
            return objB.vote_average - objA.vote_average;
        });
        this.setState({
            movies : [...temp],
        })
    }

    handleRatingAsc = () => {
        let temp = this.state.movies;
        temp.sort(function(objA, objB){
            return objA.vote_average - objB.vote_average;
        });
        this.setState({
            movies : [...temp],
        })
    }

    handlePageChange = (page) =>{
        this.setState({
            currPage:page
        })
    }

    handleDelete = (id) => {
        let newArr = [];
        newArr = this.state.movies.filter((movieObj) => movieObj.id != id);

        this.setState({
            movies : [...newArr],
        })
        localStorage.setItem("movies", JSON.stringify(newArr));
    }

    render() {      
        let genreids = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
        27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',10770:'TV',53:'Thriller',10752:'War',37:'Western'};
        
        let filterArr = [];

        if(this.state.currText == ''){
            filterArr = this.state.movies;
        }
        else{
            filterArr = this.state.movies.filter((movieObj) => {
                let title = movieObj.original_title.toLowerCase();
                return title.includes(this.state.currText.toLowerCase());
            })
        }


        if(this.state.currGen !== 'All genres'){
            filterArr = this.state.movies.filter((movieObj) => genreids[movieObj.genre_ids[0]] == this.state.currGen);
        }


        let pageLength = Math.ceil(filterArr.length/this.state.limit);
        let pageArr = [];
        for(let i = 1; i <= pageLength; i++){
            pageArr.push(i);
        }
        let si = (this.state.currPage - 1) * this.state.limit;
        let ei = si + (this.state.limit);
        filterArr = filterArr.slice(si,ei);

        return (
            <>
                <div className='main'>
                    <div className='row'>
                        <div className='col-lg-3 col-sm-12'>
                            <ul class="list-group favourites-genre">
                                {
                                    this.state.generes.map((genre) => (
                                        (this.state.currGen === genre) ? <li class="list-group-item" style={{backgroundColor:"#3f51b5", color:"white",fontWeight:"bold"}}>{genre}</li>:
                                        <li class="list-group-item" style={{backgroundColor:"white", color:"#3f51b5"}} onClick={()=>this.handleGenre(genre)}>{genre}</li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className='col-lg-9 favourites-table col-sm-12'>
                            <div className='row' >
                                <input type="text" className='input-group-text col' placeholder='Search' value={this.state.currText}  onChange={(e)=> this.setState({currText: e.target.value})} />
                                <input type="number" className='input-group-text col' placeholder='Row-count' value={this.state.limit} onChange={(e)=> this.setState({limit: e.target.value})}/>
                            </div>
                            <div className='row' >
                                <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Genre</th>
                                        <th scope="col"><i class="fas fa-sort-up" onClick={this.handleSortDesc} />Popularity<i class="fas fa-sort-down" onClick={this.handleSortAsc}/></th>
                                        <th scope="col"><i class="fas fa-sort-up" onClick={this.handleRatingDesc} />Rating<i class="fas fa-sort-down" onClick={this.handleRatingAsc} /></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        filterArr.map((movieObj) => (
                                            <tr>
                                                <td><img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} style={{width:"3rem"}}/> {movieObj.original_title}</td>
                                                <td>{genreids[movieObj.genre_ids[0]]}</td>
                                                <td>{movieObj.popularity}</td>        
                                                <td>{movieObj.vote_average}</td>
                                                <td><button type="button" class="btn btn-danger" onClick={()=> this.handleDelete(movieObj.id)} >Delete</button></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>

                                </table>
                            </div>

                           
                            <nav aria-label="Page navigation example">
                                <ul class="pagination">
                                    {
                                        pageArr.map((page) => (
                                            <li class="page-item"><a class="page-link" onClick={()=>this.handlePageChange(page)}>{page}</a></li>
                                        ))
                                    }
                                </ul>
                            </nav>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}
