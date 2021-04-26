// adapted from https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react
import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      errors: this.props.errors
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>User Item</ModalHeader>
        <ModalBody>
          <Form>
            <ul>
                {
                    Object.keys(this.props.errors).map((key, index) => (
                      <li key={index}>Error in {key} field: {this.props.errors[key]}</li>
                    ))
                }
            </ul>
            <FormGroup>
              <Label for="user-first_name">First Name</Label>
              <Input
                type="text"
                id="user-first_name"
                name="first_name"
                value={this.state.activeItem.first_name}
                onChange={this.handleChange}
                placeholder="Enter User's first name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="user-title">Last Name</Label>
              <Input
                type="text"
                id="user-last_name"
                name="last_name"
                value={this.state.activeItem.last_name}
                onChange={this.handleChange}
                placeholder="Enter User's last name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="user-title">Username</Label>
              <Input
                type="text"
                id="user-username"
                name="username"
                value={this.state.activeItem.username}
                onChange={this.handleChange}
                placeholder="Enter User's username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="user-title">Password</Label>
              <Input
                type="password"
                id="user-password"
                name="password"
                value={this.state.activeItem.password}
                onChange={this.handleChange}
                placeholder="Enter User's password"
              />
            </FormGroup>
            <FormGroup>
              <Label for="user-title">Email</Label>
              <Input
                type="email"
                id="user-email"
                name="email"
                value={this.state.activeItem.email}
                onChange={this.handleChange}
                placeholder="Enter User's email"
              />
            </FormGroup>

            <FormGroup>
              <Label for="user-title">Date of Birth</Label>
              <Input
                type="Date"
                id="user-date_of_birth"
                name="date_of_birth"
                value={this.state.activeItem.date_of_birth}
                onChange={this.handleChange}
                placeholder="Enter User's date of birth"
              />
            </FormGroup>

          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}