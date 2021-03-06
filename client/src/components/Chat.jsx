import React from "react";
import io from "socket.io-client";
import Modal from 'react-responsive-modal';
import { Button, Dimmer, Loader, Image, Segment, Transition, Form, Message, TextArea, Icon, Header, Container, Divider, Label} from 'semantic-ui-react';

class Chat extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.currentUser,
      message: '',
      messages: [],
      openChat: this.props.chatOpen
    };
    const addMessage = (data) => {
      this.setState({messages: [...this.state.messages, data]});
    };
    this.props.socket.on('new message', function(data) {
      addMessage(data);
    });
  }

  usernameOnChange(event) {
    this.setState({username: event.target.value});
  }

  messageOnChange(event) {
    this.setState({message: event.target.value});
  }

  handleKeyUp(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  sendMessage() {
    if(this.state.username === '') {
      var chatUsername = document.getElementById('chatUsername').value;
    } else {
      chatUsername = this.props.currentUser
    }
    if (this.state.message) {
      this.props.socket.emit('message', {
        username: chatUsername,
        message: this.state.message
      });
      this.setState({message: ''});
    }
  }
 
  onCloseChat() {
    this.setState({ openChat: false });
    this.props.onChatClose();
  };

  render(){
      return (
          <div>
           <Modal open={this.state.openChat} onClose={this.onCloseChat.bind(this)} id="loginModal">
            <Header as='h2'><Icon name='talk outline' color='green'/><Header.Content>Shill Your Coin Here!</Header.Content></Header>
            <hr/>
              <div className="messages">
              <Container textAlign='left'>
              <Segment color='green'>
                  {this.state.messages.map((message, index) =>
                    message instanceof Object ? (
                      <div key={index}>{message.username || 'Anonymous'}: {message.message}</div>
                    ) : (
                      <div key={index}>{message}</div>
                    )
                  )}
              </Segment>
              </Container>
              </div>
            <div>    
                <Divider hidden />
                {this.state.username === '' ? <Form><Form.Field> <label>Username</label>  
                <input id="chatUsername" type="text" placeholder="Username"></input>
                </Form.Field></Form> : <div><Label as='a' color='black'>Logged In As   </Label><Label as='a' color='green'><Icon name='id card outline'/>{this.state.username}</Label></div>}
                <br/>
                <Form><Form.Field> <label>Message</label> 
                <TextArea placeholder='Message' value={this.state.message} onChange={this.messageOnChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)} style={{ minHeight: 100 }} />
                </Form.Field></Form>
                <br/>
                <Button onClick={this.sendMessage.bind(this)} basic color='green'>Send</Button>
            </div>
            </Modal>
          </div>
      );
  }
}



export default Chat;
