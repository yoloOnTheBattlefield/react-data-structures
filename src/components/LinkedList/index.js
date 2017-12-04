import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import uuidV4 from 'uuid/v4';
import faker from 'faker';
import './transitions.css';

/**
 * Linked list
 */
/*
function LinkedList () {
  this.head = null;
}

LinkedList.prototype.isEmpty = function() {
  return this.head === null;
};

LinkedList.prototype.size = function() {
  let current = this.head;
  let count = 0;
  while(current !== null){
    count ++;
    current = current.next;
  }

  return count;
};

LinkedList.prototype.prepend = function(val) {
  const newNode = {
    data: val,
    next: this.head
  }
  this.head = newNode;
};

LinkedList.prototype.append = function(val) {
  const newNode = {
    data: val, 
    next: null
  }
  if(this.isEmpty()){
    this.head = newNode;
    return;
  }

  let current = this.head;

  while(current.next !== null){
    current = current.next;
  }
  current.next = newNode;
};

LinkedList.prototype.contains = function(val){
  let current = this.head;

  while(current !== null){
    if(current.data === val){
      return true
    }
    current = current.next;
  }
  return false
} ;

LinkedList.prototype.remove = function(val) {
  if(!this.contains(val)){
    return;
  }
  if(this.head.data === val){
    this.head = this.head.next;
    return;
  }

  let prev = null;
  let current = this.head;
  while(current.data !== val){
    prev = current;
    current = current.next;
  }

  prev.next = current.next;
};

LinkedList.prototype.print = function() {
  let output = '[';
  let current = this.head;

  while(current !== null){
    output += current.data;
    if(current.next !== null){
      output += ', '
    }
    current = current.next;
  }
  output += ']';
  console.log(output);
};
*/

class LinkedList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      head: null,
      output: [],
      value: '',
    };
  }

  isEmpty = () => this.state.head === null;

  prepend = ({ value, head }) => {
    if(!value.length){
      return;
    }
    const newNode = {
      data: value,
      next: head,
      prepended: true,
      id: uuidV4()
    }
    this.setState({ head: newNode, value: '' })
  }

  append = () => {
    if(!this.state.value.length) {
      return;
    }
    const newNode = {
      data: this.state.value, 
      next: null,
      prepended: false, 
      id: uuidV4()
    }
    if(this.isEmpty()) {
      this.setState({ head: newNode, value: ''})
      return;
    }

    let current = this.state.head;
    console.log('before',current)

    while(current.next !== null) {
      current = current.next;
    }
    current.next = newNode;

    console.log(current)
    // I have literally no idea why this works ?!?!?!?
    this.setState({ head: {...this.state.head}, value: '' });
  }

  contains = (val) => {
    let current = this.state.head;

    while(current !== null){
      if(current.data === val.data) {
        return true
      }
      current = current.next;
    }
    return false
  }

  handleRemove = (val) => {
    if(!this.contains(val)) {
      return;
    }
    if(this.state.head.data === val.data) {
      // this.head = this.head.next;
      this.setState({head: this.state.head.next})
      return;
    }

    let prev = null;
    let current = this.state.head;
    while(current.data !== val.data) {
      prev = current;
      current = current.next;
    }

    prev.next = current.next;
    this.setState({head: { ...this.state.head, prev }})
  }

  print = () => {
    let output = [];
    let current = this.state.head;
    while(current !== null){
      output = [...output, current];
      current = current.next;
    }
    this.setState({ output: [...output] });
  }


  handleChange = (e) => this.setState({ value: e.target.value});

  setClicked = (el) => console.log(el)


   makeFakeData = (head) => {
    const userName = faker.internet.userName();
    const data = {
      value: userName,
      head: head
    }
    this.prepend(data);
  }

  componentDidMount(){
    window.addEventListener('keydown', (e) => {
      var code = (e.keyCode ? e.keyCode : e.which);
      if(e.keyCode  == 13) { //Enter keycode
        if(this.state.value){
          this.prepend({ head: this.state.head, value: this.state.value })
        }
      }
    });
    const times = [1,2,3,4,5];
    times.forEach((time) => {
      setTimeout(() => {
        this.makeFakeData(this.state.head)
      }, time * 200);
    })
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.head !== this.state.head){
      this.print()
    }
  }

  render(){
    return (
      <div>
        <Heading>Linked List</Heading>
        <Content>

          <input value={this.state.value} onChange={this.handleChange} />
          <button onClick={() => this.prepend({ value: this.state.value, head: this.state.head })}>Prepend</button>
          <button onClick={this.append}>Append</button>
          <Overflow>
          <TransitionGroup className='list-container'>
            {
              this.state.head && this.state.output.map((item, index) => {
                return (
                <CSSTransition
                    key={item.id}
                    classNames={item.prepended ? 'node-pre' : 'node-app'}
                    timeout={1200}
                  >
                    <Item
                      onClick={() =>  this.setClicked(item)}
                    >
                      {item.data}
                      <DeleteButton onClick={() => this.handleRemove(item)} />
                    </Item>
                </CSSTransition>
              )})
            }
          </TransitionGroup>
          </Overflow>
        </Content>
        <ButtonContainer>
          <Button>Demo</Button>
          <Button>Learn</Button>
        </ButtonContainer>
      </div>
    )
  }
}

export default LinkedList;

const Overflow = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const Heading = styled.div`
  width: 100%;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 55px;
  color: white;
 background: #000000;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #53346D, #000000);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #53346D, #000000); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

`;

const Item = styled.div`
  height: 50px;
  padding: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #667db6;  
  margin: 5px;
  box-sizing: border-box;
  color: white;
  position: relative;
  box-shadow: 0px 5px 20px rgba(0,0,0,0.5);
  border-radius: 5px;
`;

const Content = styled.div`
  width: 100%;
  height: calc(80vh - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Button = styled.div`
  width: 150px;
  height: 50px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 0 5px;
`;

const DeleteButton = styled.div`
  width: 20px;
  height: 20px;
  background: red;
  border-radius: 50%;
  margin-left: 10px;
`;


