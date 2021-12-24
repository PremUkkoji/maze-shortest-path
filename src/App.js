import {Component, React} from 'react'
import './App.css'

class App extends Component{
	
	path = [];
	grid = [];
	visited = [];
	blocks = [];
	big = 99999999;

	constructor(props){
		super(props)

		var n = 14, m = 35;
		this.state = {
			si: Math.floor(Math.random() * n),
			sj: Math.floor(Math.random() * m),
			ei: Math.floor(Math.random() * n),
			ej: Math.floor(Math.random() * m),
			n: n,
			m: m,
			change: false,
			message: "Change start and end point",
			showReset: false,
			disableBtn: false
		}

		for(var i=0;i<n;i++){
			this.grid.push([]);
			this.visited.push([]);
			this.blocks.push([]);
			for(var j=0;j<m;j++){
				this.grid[i].push(this.big);
				this.visited[i].push(false);
				this.blocks[i].push(false);
			}
		}

		this.randomBlocks()
		this.path = [];
	}

	resetMatrix = () => {
		this.grid = [];
		this.visited = [];
		for(var i=0;i<this.state.n;i++){
			this.grid.push([]);
			this.visited.push([]);
			for(var j=0;j<this.state.m;j++){
				var id = i + "_" + j
				var element = document.getElementById(id)
				element.classList.remove("path")
				this.grid[i].push(this.big);
				this.visited[i].push(false);
			}
		}

		this.randomBlocks()
		this.path = [];

		this.setState(prevState => ({
			...prevState,
			message: "Change start and end point",
			showReset: false
		}))
	}

	randomBlocks = () => {
		//setting initial start and end point
		var _si = Math.floor(Math.random() * this.state.n)
		var _sj = Math.floor(Math.random() * this.state.m)
		var _ei = Math.floor(Math.random() * this.state.n)
		var _ej = Math.floor(Math.random() * this.state.m)

		// generating random blocks
		var totalBlocks = this.state.n * this.state.m
		var nblocks = Math.ceil(totalBlocks * 0.4)

		// clear present blocks
		this.blocks = [];
		for(var i=0;i<this.state.n;i++){
			this.blocks.push([]);
			for(var j=0;j<this.state.m;j++){
				this.blocks[i].push(false);
			}
		}

		for(var k=0;k<nblocks;k++){
			var bi = Math.floor(Math.random() * this.state.n)
			var bj = Math.floor(Math.random() * this.state.m)

			if(bi === _si && bj === _sj) continue;
			if(bi === _ei && bj === _ej) continue;

			this.blocks[bi][bj] = true;
		}

		this.setState(prevState => ({
			...prevState,
			si: _si,
			sj: _sj,
			ei: _ei,
			ej: _ej,
		}))
	}

	findPath = (i, j, cnt) => {
		if(i === this.state.ei && j === this.state.ej){
			this.grid[i][j] = cnt;
		}

		this.grid[i][j] = cnt;
		var newcnt = cnt;
		newcnt = newcnt+1;

		if(i-1 >= 0 && !this.blocks[i-1][j] && this.grid[i-1][j] > newcnt){
			this.findPath(i-1, j, newcnt)
		}
		if(i+1 < this.state.n && !this.blocks[i+1][j] && this.grid[i+1][j] > newcnt){
			this.findPath(i+1, j, newcnt)
		}
		if(j-1 >= 0 && !this.blocks[i][j-1] && this.grid[i][j-1] > newcnt){
			this.findPath(i, j-1, newcnt)
		}
		if(j+1 < this.state.m && !this.blocks[i][j+1] && this.grid[i][j+1] > newcnt){
			this.findPath(i, j+1, newcnt)
		}
	}

	getPath = (i, j) => {
		if(i===this.state.si && j===this.state.sj){
			return true
		}

		this.visited[i][j] = true;
		var temp = false;
		if(i-1 >= 0 && !this.visited[i-1][j] && !this.blocks[i-1][j] && this.grid[i-1][j] < this.grid[i][j]){
			temp = this.getPath(i-1, j);
			if(temp){
				this.path.push([i-1, j])
				return temp
			}
		}
		if(i+1 < this.state.n && !this.visited[i+1][j] && !this.blocks[i+1][j] && this.grid[i+1][j] < this.grid[i][j]){
			temp = this.getPath(i+1, j)
			if(temp){
				this.path.push([i+1, j])
				return temp
			}
		}
		if(j-1 >= 0 && !this.visited[i][j-1] && !this.blocks[i][j-1] && this.grid[i][j-1] < this.grid[i][j]){
			temp = this.getPath(i, j-1)
			if(temp){
				this.path.push([i, j-1])
				return temp
			}
		}
		if(j+1 < this.state.m && !this.visited[i][j+1] && !this.blocks[i][j+1] && this.grid[i][j+1] < this.grid[i][j]){
			temp = this.getPath(i, j+1)
			if(temp){
				this.path.push([i, j+1])
				return temp
			}
			
		}
		return false
	}

	animatePath = () => {
		var i = 1;
		let animate_job;
		if(animate_job){
			clearInterval(animate_job);
		}
		this.setState(prevState => ({
			...prevState,
			disableBtn: true
		}))
		animate_job = setInterval(() => {
			console.log(i, this.path.length)
			var id = this.path[i][0] + "_" + this.path[i][1]
			var element = document.getElementById(id)
			element.classList.add("path")
			i = i+1;
			if(i >= this.path.length-1){
				this.setState({message: "Path found (Reset to do it again)"})
				clearInterval(animate_job);
				this.setState(prevState => ({
					...prevState,
					disableBtn: false
				}))
			}
		}, 100)

		this.setState(prevState => ({
			...prevState,
			showReset: true
		}))
	}

	findClick = (event) => {
		event.preventDefault();

		var ci = this.state.si;
		var cj = this.state.sj;

		this.path = [];
		this.findPath(ci, cj, 0)

		if(this.grid[this.state.ei][this.state.ej] === this.big){
			this.setState(prevState => ({
				...prevState,
				message: "No path found (Reset to shuffle blocks)",
				showReset: true
			}))
		}else{
			this.getPath(this.state.ei, this.state.ej)
			this.path.push([this.state.ei, this.state.ej])
			this.setState({message: "Path found"})
			this.animatePath()
		}

		this.setState(prevState => ({
			...prevState,
			change: !prevState.change
		}))
	}

	inputChange = (event) => {
		const target = event.target
		const name = target.name
		const value = parseInt(target.value)

		this.setState({
			[name]: value
		})
	}

	render(){
		return (
			<div className="root">
				<form className="userinput" onSubmit={this.findClick}>
					<p>Start Location</p>
					start row : <input 
							className="inp"
							type="number"
							min="0"
							max={this.state.n-1}
							name="si"
							value={this.state.si}
							onChange={this.inputChange}
							required
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
					start column : <input
							className="inp"
							type="number"
							min="0"
							max={this.state.m-1}
							name="sj"
							value={this.state.sj}
							onChange={this.inputChange}
							required
						/>

					<p>End Location</p>
					end row : <input
							className="inp"
							type="number"
							min="0"
							max={this.state.n-1}
							name="ei"
							value={this.state.ei}
							onChange={this.inputChange}
							required
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
					end column : <input
							className="inp"
							type="number"
							min="0"
							max={this.state.m-1}
							name="ej"
							value={this.state.ej}
							onChange={this.inputChange}
							required
						/>

					<br/><br/>
					{
						this.state.showReset ? 
							<button disabled={this.state.disableBtn} className="findbtn" onClick={this.resetMatrix}>Reset</button> 
							: 
							<input className="findbtn" type="submit" value="Find path" />
					}
				</form>
				<div className="message"><p>{this.state.message}</p></div>
				<div className="grid">
					<div className="container">
						{
							this.grid.map((_, i) => {
								return (
									<div className="row" key={"row"+i}>
										{
											this.grid[i].map((value, j) => {
												if(i === this.state.si && j === this.state.sj){
													return (
														<div className="col start" key={"col"+j} id={i+"_"+j}></div>
													)
												}else if(i === this.state.ei && j === this.state.ej){
													return (
														<div className="col end" key={"col"+j} id={i+"_"+j}></div>
													)
												}else if(this.blocks[i][j]){
													return (
														<div className="col block" key={"col"+j} id={i+"_"+j}></div>
													)
												}else{
													return (
														<div className="col" key={"col"+j} id={i+"_"+j}></div>
													)
												}
											})
										}
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
}

export default App
