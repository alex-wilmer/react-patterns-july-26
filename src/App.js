import React, {Component, Children, cloneElement, createContext} from "react"
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom"
import logo from "./logo.svg"
import "./App.css"

let FooContext = React.createContext()

let posts = [
  {id: "1", post_title: "client side routing"},
  {id: "2", post_title: "client side routing!!!!"}
]

class Post extends Component {
  state = {post: {}, loading: true}
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        post: posts.find(p => p.id === this.props.postId),
        loading: false
      })
    }, 1000)
  }
  render() {
    return <pre>{JSON.stringify(this.state.post, null, 2)}</pre>
  }
}

let Posts = props => (
  <div>
    <h1>here are the posts</h1>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
)

let Home = props => (
  <FooContext.Consumer>
    {value => (
      <div>
        <h1>Welcome {value.foo}</h1>
        <button onClick={props.handleClick}>Click me!</button>
      </div>
    )}
  </FooContext.Consumer>
)

/*--------------------------------------*/

// PART II (deux)

let Title = props => <h3>the title is: {props.title}</h3>

class MiniApp extends Component {
  state = {title: "foo"}
  render() {
    return (
      <div>
        <h1>miniapp</h1>
        {/* OLD SCHOOL WAY: cloneElement */}
        <b>{Children.map(this.props.children, child => {
          return cloneElement(child, {
            title: this.state.title
          })
        })}</b>
        {/* NEW SCHOOL WAY: render props */}
        <b>{this.props.children(this.state.title)}</b>
        <input
          value={this.state.title}
          onChange={e => this.setState({title: e.target.value})}
        />
      </div>
    )
  }
}

let AngryTitle = props => <div>{props.title} !!!!!</div>

class GetPost extends Component {
  state = {post: {}, loading: true}
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        post: posts.find(p => p.id === this.props.postId),
        loading: false
      })
    }, 1000)
  }
  render() {
    return this.props.children(this.state)
  }
}

class App extends Component {
  render() {
    return (
      <MiniApp>
        {title =>
          <AngryTitle title={title} />
        }
      </MiniApp>
    )
  }
}

let Input = () => (
  <FooContext.Consumer>
    {value => <input value={value.foo} onChange={value.changeFoo} />}
  </FooContext.Consumer>
)

class AppState extends Component {
  state = {foo: "123bar!!!!"}
  changeFoo = e => this.setState({foo: e.target.value})
  loadFoo = e => this.setState({foo: e.target.value})
  render() {
    return (
      <FooContext.Provider
        value={{foo: this.state.foo, changeFoo: this.changeFoo}}
      >
        {this.props.children}
      </FooContext.Provider>
    )
  }
}

let OtherApp = () => (
  <AppState>
    <Router>
      <div>
        <div>
          input: <Input />
        </div>
        <ul>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to="/posts/1">Post #1</Link>
          </li>
          <li>
            <Link to="/posts/2">Post #2</Link>
          </li>
          <li>
            <Link to="/">home</Link>
          </li>
        </ul>
        <Route
          exact
          path="/"
          component={() => <Home handleClick={() => alert("hahaha")} />}
        />
        <Route path="/posts" component={Posts} />
        <Route
          path="/posts/:postId"
          component={matchProps => {
            return (
              <GetPost postId={matchProps.match.params.postId}>
                {({post, loading}) => (
                  <div>{!loading && <h3>{post.post_title}</h3>}</div>
                )}
              </GetPost>
            )
          }}
        />
      </div>
    </Router>
  </AppState>
)

export default OtherApp
