import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


interface State{
  inputCim: string;
  inputSzerzo: string;
  inputEv: number;
  inputHossz: number;
  bookList: Book[];
  servermsg: string;
}
interface Book{
  id: number;
  title: string;
  author: string;
  publish_year: number;
  page_count: number;
}
interface ResponseBook{
  data: Book[]
}
interface  errorInterface{
  statusCode : number,
  message: string,
  error: ""
}
class App extends Component<{}, State>{
  constructor(props : {}) {
    super(props);
    this.state = {
      inputCim: "",
      inputSzerzo: "",
      inputEv: 0,
      inputHossz: 0,
      bookList: [],
      servermsg: ""

    }
  }
  loadData = async () => {
    let response = await fetch("http://localhost:3000/api/books")
    let data = await response.json() as ResponseBook 
    this.setState({
      bookList : data.data
    })
  }
  rentbook = async (id: number) => {
    let response = await fetch("http://localhost:3000/api/books/"  + id + "/rent", {
      method: "POST"
    })
    if(!response.ok){
      let error = await response.json() as errorInterface
      this.setState({
        servermsg : error.message
      })
    } else {
      this.setState({
        servermsg : "Sikeres foglalás anyád"
      })
    }
   
  }
  addNewBook = async () => {
    let data : Book = {
      id: 0,
      title: this.state.inputCim,
      author: this.state.inputSzerzo,
      page_count: this.state.inputHossz,
      publish_year: this.state.inputEv,

    }

    let response = await fetch("http://localhost:3000/api/books", {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      this.setState({
        inputCim: "",
        inputSzerzo: "",
        inputHossz: 0,
        inputEv: 0,
      })
      this.loadData()
    }
  }
  componentDidMount(): void {
      this.loadData()
  }
  render(): React.ReactNode{
    return( 
      <div>
        <Container>
          <h1>{this.state.servermsg}</h1>
          <Row>
            {this.state.bookList.map(item => (
              <Col md={3} sm={6} xs={6}>
                <Card style={{width: "18rem", border: "1px solid black"}}>
                  <Card.Img variant="top" src={item.author + ".jpg"} />
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>
                    <p>{item.author}</p>
                    <p>{item.publish_year}</p>
                    <p>{item.page_count}</p>
                    </Card.Text>
                    <Button onClick={(event => {this.rentbook(item.id)})}>Kölcsönzés</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <p>Add meg a könyv címét</p>
          <input type='text' onChange={event => this.setState({inputCim : event.currentTarget.value})}/>
          <p>Add meg a szerzőt </p>
          <input type='text' onChange={event => this.setState({inputSzerzo : event.currentTarget.value})}/>
          <p>Add meg a lapok számát </p>
          <input type='number' onChange={event => this.setState({inputHossz : parseInt(event.currentTarget.value)})}/>
          <p>Add meg a kiadás évét</p>
          <input type='number' onChange={event => this.setState({inputEv : parseInt(event.currentTarget.value)})}/>
          <input type='button' onClick={this.addNewBook} value={"Új felvétele"}/>
        </Container>
        </div>
    )
  }
  
}
export default App;
