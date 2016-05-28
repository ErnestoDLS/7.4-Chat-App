import React from 'react'
import $ from 'jquery'
import Serialize from 'form-serialize'
import ReactDOM from 'react-dom'

export default React.createClass({
  getInitialState(){
    return {
      users: []
    }
  },
  getDefaultProps() {
    return {
      source: "http://tiny-tiny.herokuapp.com/collections/ernesto_chat"
    }
  },
  componentDidMount(){
    setInterval(()=> {
      $.get(this.props.source, (resp)=> {
        this.setState({ messages: resp})
        console.log(resp);
      })
    }, 2000)
  },
  handleSubmitForm(e){
    e.preventDefault();
    var serializedForm = Serialize(this.refs.userForm, {hash: true})
    $.post(this.props.source, serializedForm, (resp)=>{
      $.get(this.props.source, (resp)=> {
        this.setState({ users: resp})
      })
      this.refs.input.value="";
    })
  },
  handleUserDelete(e){
    var userId = $(e.target).parent().data("id");
    $.ajax({
      url: `${this.props.source}/${userId}`,
      method: "DELETE",
      dataType: "JSON",
      success: (resp)=> {
        $.get(this.props.source, (resp)=> {
          this.setState({users: resp})
        })
      }
    })
  },
  render() {
    return (
      <article>
          <h1 className="heading">Chat App</h1>
          <form className="form" method="POST" ref="userForm" action="#" onSubmit={this.handleSubmitForm}>
            <input className="input_bar" autoComplete="Off" type="text" ref="input" name="username" placeholder="please clap"/>
            <input type="submit" value="Send"/>
          </form>
            <ul>
             {this.state.users.map((user)=> {
               return <li key={ user._id } data-id={ user._id }><h5>Username</h5>{user.username}<span onClick={this.handleUserDelete}></span>
               <i onClick={this.handleUserDelete} className="fa fa-times-circle"></i>
               </li>
             }, this)}
           </ul>

      </article>
    )
  }
})
