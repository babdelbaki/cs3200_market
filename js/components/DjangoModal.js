// adapted from https://www.digitalocean.com/community/tutorials/build-a-to-do-application-using-django-and-react
import React, { useState, useEffect } from 'react';
import { render } from "react-dom";
import axios from "axios";
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

const DjangoModal = (props) => {
    const endpoint = props.endpoint
    const options = props.options
    const [activeItem, setActiveItem] = useState(props.activeItem)
    const [errors, setErrors] =  useState(props.errors)
    const { toggle, onSave, excluded } = props;

    const handleChange = (e) => {
        let { name, value, localName, type, checked } = e.target;
        console.log(e)
        if(type === "checkbox"){
            setActiveItem({...activeItem, [name]: checked })
        } else {
            setActiveItem({...activeItem, [name]: value })
        }

        console.log(activeItem, name, value);
    };

    const getFormType = (name, type) => {
        var formType
        switch(type) {
            case "string":
                formType = "text"
                break;
            case "decimal":
                formType = "number"
                break
            case "integer":
                formType = "integer"
            case "date":
                formType = "date"
                break
            case "email":
                formType = "email"
                break
            case "choice":
                formType = "select"
                break
            case "field":
                formType = "select"
                break
            case "boolean":
                formType = "checkbox"
                break
        }
        if (name === "password"){
            formType = "password"
        }
        return formType
    }

    const getIncluded = (name) => {
        // if included
        if(!(excluded.indexOf(name) > -1)){
            return true
        } else {
            return false
        }
    }

    useEffect(() => {

    }, []);

    return (
        <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add or edit {endpoint}</ModalHeader>
        <ModalBody>
          <Form>
            <ul>
                {
                    // render errors
                    Object.keys(props.errors).map((form_field, index) => (
                      <li key={index}>Error in {options[form_field]["label"]} field: {props.errors[form_field]}</li>
                    ))
                }
            </ul>
            {
                // render form fields
                // different behavior if "select" field
                Object.keys(options).map((form_field, index) => {
                    var formType = getFormType(form_field, options[form_field]["type"])
                    var included = getIncluded(form_field)
                    if(included & formType == "select"){
                        return(
                            <FormGroup>
                                <Label for={`${endpoint}-${form_field}`}>{options[form_field]["label"]}</Label>
                                <Input
                                    type= {formType}
                                    id= {`${endpoint}-${form_field}`}
                                    name= {form_field}
                                    value={activeItem[form_field]}
                                    onChange={handleChange}
                                >
                                    <option value = {null}> ------ </option>
                                    {
                                        options[form_field]["choices"].map((choice,index) => (
                                            <option value = {choice.value}> {choice.display_name} </option>
                                        ))
                                    }
                                </Input>
                            </FormGroup>
                        )
                    } else if (included){
                        return(
                            <FormGroup>
                                <Label for={`${endpoint}-${form_field}`}>{options[form_field]["label"]}: <br />
                                    <Input
                                        type= {formType}
                                        id= {`${endpoint}-${form_field}`}
                                        name= {form_field}
                                        value={activeItem[form_field]}
                                        onChange={handleChange}
                                        placeholder= {`Enter ${endpoint}'s ${options[form_field]["label"]}`}
                                        defaultChecked = { activeItem[form_field] }
                                    />
                                </Label>
                            </FormGroup>
                        )
                    }
                })
            }
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
}

export default DjangoModal



