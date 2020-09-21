import React from 'react';
import Highlight from 'react-highlight.js';
import './method.css';
let axios=require("axios");

class Method extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={};
	}

	componentDidMount()
	{
		axios.get("/doc/api/method")
		.then(res=>{
			this.setState({methods:res.data});
		})
		.catch(e=>console.log(e));
	}

	clear()
	{
		this.setState({
			title:"",
			description:"",
			args:[[]],
			returns:[[]],
			examples:[],
			module:"",
			realm:"",

			argtype:"",
			argdesc:"",
			returntype:"",
			returndesc:"",
			example:""
		});
	}

	create(e)
	{
		let o={};
		o.title=this.state.title;
		o.description=this.state.description;
		o.args=this.state.args;
		o.returns=this.state.returns;
		o.examples=this.state.examples;
		o.output=this.state.output;
		o.module=this.state.module;
		o.realm=this.state.realm;
		axios.post("/doc/api/method",o)
		.then(res=>{
			let old=this.state.methods;
			old.push(res.data);
			this.setState({methods:old});
			this.clear();
		})
		.catch(e=>console.log(e));
		e.preventDefault();
	}

	update(e)
	{
		this.setState({[e.target.name]:e.target.value});
	}

	delet(e,title)
	{
		axios.delete("/doc/api/method/"+title)
		.then(res=>{
			for(let i=0;i<this.state.methods.length;i++)
			{
				if(this.state.methods[i].title==title)
				{
					this.state.methods.splice(i,1)
					this.setState({methods:this.state.methods});
					break;
				}
			}
		})
		.catch(e=>console.log(e));
	}

	dohrcol(e)
	{
		if(e=="server"||e=="Server")
		{
			return "hrsv";
		}
		else if(e=="client"||e=="Client")
		{
			return "hrcl"
		}
		else if(e=="shared"||e=="Shared")
		{
			return "hrsh";
		}
		return "";
	}

	dotxtcol(e)
	{
		if(e=="server"||e=="Server") {
			return "svcol";
		}
		else if(e=="client"||e=="Client") {
			return "clcol"
		}
		else if(e=="shared"||e=="Shared") {
			return "shcol";
		}
		return "";
	}

	show()
	{
		if(!this.state.methods) return (<div></div>);
		let docs=[];
		for(let i=0;i<this.state.methods.length;i++)
		{
			let doc=this.state.methods[i];
			for(let j=0;j<doc.args.length;j++)
			{
				doc.args[j]=(
					<li>{doc.args[j][0]}
						<ul>
							<li>{doc.args[j][1]}</li>
						</ul>
					</li>
				);
			}
			for(let j=0;j<doc.returns.length;j++)
			{
				doc.returns[j]=(
					<li>{doc.returns[j][0]}
						<ul>
							<li>{doc.returns[j][1]}</li>
						</ul>
					</li>
				);
			}
			for(let j=0;j<doc.examples.length;j++)
			{
				doc.examples[j]=
				(
					<Highlight language="lua">
						<pre><code>{doc.examples[j]}</code></pre>
					</Highlight>
				);
			}
			docs[i]=(
				<div className="doc">
					<h1 className={this.dotxtcol(doc.realm)}>{doc.title}</h1>
					<h3 className={this.dotxtcol(doc.realm)}>Description:</h3>
					<hr className={this.dohrcol(doc.realm)}></hr>
					<p className="pad2lr">{doc.description}</p>
					<h3 className={this.dotxtcol(doc.realm)}>Arguments:</h3>
					<hr className={this.dohrcol(doc.realm)}></hr>
					<ol>
						{doc.args}
					</ol>
					<h3 className={this.dotxtcol(doc.realm)}>Returns:</h3>
					<hr className={this.dohrcol(doc.realm)}></hr>
					<ol>
						{doc.returns}
					</ol>
					<h3 className={this.dotxtcol(doc.realm)}>Examples:</h3>
					<hr className={this.dohrcol(doc.realm)}></hr>
					{doc.examples}
					<h3 className={this.dotxtcol(doc.realm)}>Output:</h3>
					<hr className={this.dohrcol(doc.realm)}></hr>
					<Highlight language="lua">
						<pre><code>{doc.output}</code></pre>
					</Highlight>
					<h3 className={this.dotxtcol(doc.realm)}>Module:</h3>
					<hr className={this.dohrcol(doc.realm)}></hr>
					<p className="pad2lr">{doc.module}</p>
					<h3 className={this.dotxtcol(doc.realm)}>Realm:</h3>
					<hr className={this.dohrcol(doc.realm)}></hr>
					<p className="pad2lr">{doc.realm}</p>
					<button onClick={(e) => {}}>Edit</button>
					<button onClick={(e) => {this.delet(e,doc.title)}}>Delete</button>
				</div>
			);
		}
		return docs;
	}

	keydown(ev)
	{
		let k=ev.keyCode||ev.which;
		let v=ev.target.value;
		let s=ev.target.selectionStart;
		let e=ev.target.selectionEnd;
		if(k==9)
		{
			ev.target.value=v.substr(0,s)+"\t"+v.substr(s,e);
			ev.target.selectionStart=s+1;
			ev.target.selectionEnd=s+1;
			ev.preventDefault();
		}
	}

	pusharg(e)
	{
		if(!this.state.args) this.state.args=[];
		this.state.args.push([this.state.argtype,this.state.argdesc]);
		this.setState({
			args:this.state.args,
			argtype:"",
			argdesc:""
		});
	}

	pushret(e)
	{
		if(!this.state.returns) this.state.returns=[];
		this.state.returns.push([this.state.returntype,this.state.returndesc]);
		this.setState({
			returns: this.state.returns,
			returntype: "",
			returndesc: ""
		});
	}

	pushex(e)
	{
		if(!this.state.examples) this.state.examples=[];
		this.state.examples.push(this.state.example);
		this.setState({
			examples: this.state.examples,
			example:"",
		});
	}

	showargs()
	{
		if(!this.state.args) return (<div></div>);
		let data=[];
		for(let i=0;i<this.state.args.length;i++)
		{
			data.push((
				<li>{this.state.args[i][0]}
					<ul>
						<li>{this.state.args[i][1]}</li>
					</ul>
				</li>
			));
		}
		return data;
	}

	showreturns()
	{
		if(!this.state.returns) return (<div></div>);
		let data=[];
		for(let i=0;i<this.state.returns.length;i++)
		{
			data.push((
				<li>{this.state.returns[i][0]}
					<ul>
						<li>{this.state.returns[i][1]}</li>
					</ul>
				</li>
			));
		}
		return data;
	}

	showexamples()
	{
		if(!this.state.examples) return (<div></div>);
		let fmt=[];
		for(let i=0;i<this.state.examples.length;i++)
		{
			fmt[i]=(
				<Highlight language="lua">
					<pre><code>{this.state.examples[i]}</code></pre>
				</Highlight>
			);
		}
		return fmt;
	}

	render()
	{
		return (
			<div className="wrap">
				{this.show()}
				<h1>Creator</h1>

				<hr></hr>
				<h1>{this.state.title}</h1>
				<hr></hr>
				<textarea
					onKeyDown={(e)=>this.keydown(e)}
					name="title" 
					value={this.state.title}
					onChange={(e)=>{this.update(e)}}
					placeholder="title"
				>
				</textarea>

				<p>Description:</p>
				<p>{this.state.description}</p>
				<textarea
					onKeyDown={(e) => this.keydown(e)}
					name="description" 
					value={this.state.description}
					onChange={(e)=>{this.update(e)}}
					placeholder="description"
				></textarea>

				<h3>Args:</h3>
				<ol>
					{this.showargs()}
				</ol>
				<textarea
					onKeyDown={(e)=>this.keydown(e)}
					name="argtype" 
					value={this.state.argtype}
					onChange={(e)=>{this.update(e)}}
					placeholder="Arg Type"
				></textarea>
				<textarea
					onKeyDown={(e) => this.keydown(e)}
					name="argdesc"
					value={this.state.argdesc}
					onChange={(e) => {this.update(e)}}
					placeholder="Arg Description"
				></textarea>
				<button onClick={(e)=>{this.pusharg(e);}}>Push Arg</button>

				<h3>Returns:</h3>
				<ol>
					{this.showreturns()}
				</ol>
				<textarea
					onKeyDown={(e) => this.keydown(e)}
					name="returntype"
					value={this.state.returntype}
					onChange={(e) => {this.update(e)}}
					placeholder="Return Type"
				></textarea>
				<textarea
					onKeyDown={(e) => this.keydown(e)}
					name="returndesc"
					value={this.state.returndesc}
					onChange={(e) => {this.update(e)}}
					placeholder="Return Description"
				></textarea>
				<button onClick={(e) => {this.pushret(e);}}>Push Return</button>

				<h3>Examples:</h3>
				{this.showexamples()}
				<textarea
					onKeyDown={(e)=>this.keydown(e)}
					name="example" 
					value={this.state.example}
					onChange={(e)=>{this.update(e)}}
					placeholder="example"
				></textarea>
				<button onClick={(e) => {this.pushex(e);}}>Push Example</button>

				<p>Output:</p>
				<p>{this.state.output}</p>
				<textarea
					onKeyDown={(e)=>this.keydown(e)}
					name="output" 
					value={this.state.output}
					onChange={(e)=>{this.update(e)}}
					placeholder="output"
				></textarea>

				<p>Module:</p>
				<p>{this.state.module}</p>
				<textarea
					onKeyDown={(e)=>this.keydown(e)}
					name="module" 
					value={this.state.module}
					onChange={(e)=>{this.update(e)}}
					placeholder="module"
				></textarea>

				<p>Realm:</p>
				<p>{this.state.realm}</p>
				<textarea
					onKeyDown={(e)=>this.keydown(e)}
					name="realm" 
					value={this.state.realm}
					onChange={(e)=>{this.update(e)}}
					placeholder="realm"
				></textarea>

				<button onClick={(e)=>{this.create(e);}}>Push Doc</button>
			</div>
		);
	}
}
export default Method;