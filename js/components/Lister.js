import React, { useState, useEffect } from 'react';
import {Button} from "reactstrap";
import { render } from "react-dom";
import DjangoModal from "./DjangoModal"
import axios from "axios";
import {Link} from 'react-router-dom'


const Lister = (props) => {
    const endpoint = props.match.params.endpoint
    const [data, setData] = useState([])
    const [modal, setModal] = useState(false)
    const [activeItem, setActiveItem] = useState({})
    const [error_messages, setErrorMessages] = useState({})
    const [displayValues, setDisplayValues] = useState([])
    const [blankItem, setBlankItem] = useState([])
    const [excluded, setExcluded] = useState([])
    const [options, setOptions] = useState({})

    const determine_constants = () =>{
        if(endpoint == "users"){
            setDisplayValues(["first_name", "email", "cash", "buying_power"])
            setExcluded(["id", "cash", "buying_power", "completed_transactions", "submitted_transactions", "stock", "externaltransfer_set", "stockbalance_set"])
        } else if(endpoint == "stocks") {
            setDisplayValues(["ticker", "company_name"])
            setExcluded(["id", "market_price", "transaction_set", "stockbalance_set"])
        } else if(endpoint == "transactions"){
            setDisplayValues(["from_username", "bid", "to_username", "stock_ticker", "price", "quantity"])
            setBlankItem({"bid": "false"})
            setExcluded(["id", "from_username", "to_username", "stock_ticker", "stock_company_name"])
        } else if(endpoint == "externaltransfers"){
            setDisplayValues(["username", "deposit", "quantity"])
            setBlankItem({"deposit": "true"})
            setExcluded(["id", "username"])
        } else if(endpoint == "stockbalances"){
            setDisplayValues(["username", "stock_ticker", "quantity", "available_quantity"])
        }
    }

    const toggle = () => {
        setModal(!modal)
    }

    const handleSubmit = (item) => {
        setErrorMessages({})
        if (item.id) {
            console.log("about to update")
            axios
                .put(`/api/${endpoint}/${item.id}/`, item)
                .then((res) => determineToggle())
                .catch((err) => {
                  setErrorMessages(err.response.data)
                  console.log("error", err)
                  return
                });
        } else {
            console.log("about to update")
            axios
              .post(`/api/${endpoint}/`, item)
              .then((res) => determineToggle())
              .catch((err) => {
                  setErrorMessages(err.response.data)
                  console.log("error", err)
                  return;
              });
        }
        axios.options("/api/users/").then((res) => console.log(res.data.actions.POST));
        axios.options("/api/stocks/").then((res) => console.log(res.data.actions.POST));
    };

    const determineToggle = () => {
        console.log(error_messages)
        //if(Object.keys(error_messages).length === 0){
        toggle();
        refreshList();
        //}
    };

    const handleDelete = (item) => {
        axios
          .delete(`/api/${endpoint}/${item.id}/`)
          .then((res) => refreshList());
    };

    const createItem = () => {
        setActiveItem(blankItem)
        setModal(!modal)
    };

    const editItem = (item) => {
        const temp = {...item}
        if (endpoint == "transactions"){
            if (item.bid == "Sell") {
                temp.bid = "false"
            } else if (item.bid == "Bid") {
                temp.bid = "true"
            }
        }
        setActiveItem(temp)
        setModal(!modal)
    };

    const refreshList = () => {
      axios
          .get(`/api/${endpoint}/`)
          .then((res) => setData( res.data ))
          .catch((err) => console.log(err));
    };

    const getDisplayData = (item) => {
        // what the link text should be for this item
        // (item 1) - (item 2) - (item 3)
        const getItemEndpoint = (endpoint, i) => {
            if (endpoint == "stockbalances" && (i == 0)){
                return "users"
            } else if ((endpoint == "transactions") && ((i == 0) || (i == 2))) {
                return "users"
            } else if (endpoint == "externaltransfers" && (i == 0)){
                return "users"
            } else if ((endpoint == "stockbalances") && (i == 1)){
                return "stocks"
            } else if ((endpoint == "transactions") && (i == 3)){
                return "stocks"
            } else {
                return endpoint
            }
        }

        const getItemId = (item, endpoint, i) => {
            if ((endpoint == "stockbalances") && (i == 0)){
                return item.user
            } else if ((endpoint == "transactions") && (i == 0)){
                return item.from_user
            } else if ((endpoint == "stockbalances") && (i == 1)){
                return item.stock
            } else if ((endpoint == "transactions") && (i == 2)){
                return item.to_user
            } else if ((endpoint == "transactions") && (i == 3)){
                return item.stock
            } else if ((endpoint == "externaltransfers") && (i == 0)){
                return item.user
            } else {
                return item.id
            }
        }


        return displayValues.map((key, i, arr) =>
                            <td key = {key}>
                                {
                                    // link on relevant items (user and stock)
                                    (
                                        ((i == 1)) && (endpoint == "stockbalances") ||
                                        ((i == 2) || (i== 3)) && (endpoint == "transactions") || (i == 0)
                                    )
                                        ?
                                            (
                                            <Link to = {`/${getItemEndpoint(endpoint, i)}/${getItemId(item, endpoint, i)}`}>
                                                {item[key]}
                                            </Link>
                                            )
                                        : item[key]
                                }
                            </td>
                        )
    }

    const getOptions = (endpoint) => {
        // gets all variables for this endpoint from api, along with data types,
        // valid choices and user-friendly names
        axios.options(`/api/${endpoint}/`)
            .then((res) => {
                setOptions(res.data.actions.POST)
                console.log(res.data.actions.POST)
            });
    }

    useEffect(() => {
        getOptions(endpoint);
        determine_constants();
        refreshList();
        document.title = `${endpoint} list`
    }, []);

    return(
        <div>
          {
            // prevent some items from being added
            (!["stockbalances"].includes(endpoint))
            ?
                (
                <button
                    onClick={createItem}
                  >
                    Add { endpoint }
                  </button>
                )
            : (<span></span>)
          }


          {modal ? (
              <DjangoModal
                activeItem={activeItem}
                toggle={toggle}
                onSave={handleSubmit}
                errors={error_messages}
                endpoint={endpoint}
                excluded={excluded}
                options = {options}
              />
          ) : null}
        <table>
             <thead>
                <tr>
                    {
                    displayValues.map((item, i, arr) => (
                        <td key = {item}>
                            {
                                // prevents errors as it will try to load the state variable before it is set
                                (Object.keys(options).length !== 0)
                                    ? options[item]["label"]
                                    : "Loading"
                            }
                        </td>
                    ))
                    }
                </tr>
            </thead>
            <tbody>
            {data.map((item, i) => (
                <tr key={item.id}>
                    {getDisplayData(item)}
                    <td>
                    {
                    // prevent some items from being edited (stockbalances, external transfers, completed transactions)
                        (!["stockbalances", "externaltransfers", "transactions"].includes(endpoint) ||
                            ((endpoint === "transactions") && (item["to_user"] == null))
                        ) ?
                            (
                              <button
                                onClick = {() => editItem(item)}
                              >
                                Edit
                              </button>
                            )
                        : (<span></span>)
                    }
                    {
                    // prevent some items from being deleted (stockbalances, external transfers, completed transactions)
                        (!["stockbalances", "externaltransfers", "transactions"].includes(endpoint) ||
                            ((endpoint === "transactions") && (item["to_user"] == null))
                        ) ?
                            (
                              <button
                                onClick = {() => handleDelete(item)}
                              >
                                Delete
                              </button>
                            )
                        : (<span></span>)
                    }
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default Lister