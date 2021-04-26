import React, { Component  } from 'react';
import { render } from "react-dom";
import Modal from "./Modal"
import axios from "axios";
import {Link} from 'react-router-dom'


// code adpated from https://www.valentinog.com/blog/drf/#django-and-react-together
// and https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react#:~:text=React%20is%20a%20JavaScript%20framework,common%20practices%20in%20web%20development.&text=This%20application%20will%20allow%20users,them%20as%20complete%20or%20incomplete.
class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          modal: false,
          activeItem: {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            email: "",
            date_of_birth: "",
          },
          error_messages: {}
        };
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item) => {
        this.setState({ error_messages: {} });
        if (item.id) {
            axios
                .put(`/api/users/${item.id}/`, item)
                .then((res) => this.determineToggle())
                .catch((err) => {
                  this.setState({ error_messages: err.response.data });
                  return;
                });
        } else {
            axios
              .post("/api/users/", item)
              .then((res) => this.determineToggle())
              .catch((err) => {
                  this.setState({ error_messages: err.response.data });
                  return;
              });
        }
        axios.options("/api/users/").then((res) => console.log(res));
        axios.options("/api/stocks/").then((res) => console.log(res));
    };

    determineToggle = () => {
        if(Object.keys(this.state.error_messages).length === 0){
            this.refreshList();
            this.toggle();
        }
    };

    handleDelete = (item) => {
        axios
          .delete(`/api/users/${item.id}/`)
          .then((res) => this.refreshList());
    };

    createItem = () => {
        const item = {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            email: "",
            date_of_birth: "",
        };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };


    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
      axios
          .get("/api/users/")
          .then((res) => this.setState({ data: res.data }))
          .catch((err) => console.log(err));
    }

  render() {
    return (
        <div>
          <button
            onClick={this.createItem}
          >
            Add User
          </button>
          {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                toggle={this.toggle}
                onSave={this.handleSubmit}
                errors={this.state.error_messages}
              />
          ) : null}

          <ul>
            {this.state.data.map(user => (
                <li key={user.id}>
                    <Link to = {`/users/${user.id}`}>
                        {user.first_name} - {user.email}
                    </Link>
                    <span>
                      <button
                        onClick = {() => this.editItem(user)}
                      >
                        Edit
                      </button>
                      <button
                        onClick = {() => this.handleDelete(user)}
                      >
                        Delete
                      </button>
                    </span>
                </li>
            ))}
          </ul>
        </div>
    );
  }
}


export default UserList;