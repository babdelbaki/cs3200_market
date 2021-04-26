import React, { useState, useEffect } from 'react';
import {Button} from "reactstrap";
import { render } from "react-dom";
import DjangoModal from "./DjangoModal"
import axios from "axios";
import {Link} from 'react-router-dom'

const Detail = (props) => {
    const endpoint = props.match.params.endpoint
    const item_id = props.match.params.item_id
    const [item, setItem] = useState([])
    const [modal, setModal] = useState(false)
    const [transactionModal, setTransactionModal] = useState(false)
    const [activeItem, setActiveItem] = useState({})
    const [error_messages, setErrorMessages] = useState({})
    const [displayValues, setDisplayValues] = useState([])
    const [listDisplayValues, setListDisplayValues] = useState([])
    const [blankItem, setBlankItem] = useState([])
    const [excluded, setExcluded] = useState([])
    const [options, setOptions] = useState({})
    const [transactionOptions, setTransactionOptions] = useState({})
    const [listOptions, setListOptions] = useState([])
    const transactionExcludedFields = ["id", "from_username", "to_username", "stock_ticker", "stock_company_name"]

    const determine_list_display = () => {
        var stockBalanceFields = []
        if (endpoint == "users"){
            stockBalanceFields = ["stock_ticker", "quantity", "available_quantity"]
        } else if (endpoint == "stocks"){
            stockBalanceFields = ["username", "quantity", "available_quantity"]
        }


        const temp = {
            "transactions": ["from_username", "bid", "to_username", "stock_ticker", "price", "quantity"],
            "externaltransfers": ["deposit", "quantity"],
            "stockbalances": stockBalanceFields
        }
        setListDisplayValues({...listDisplayValues, ...temp})
    }

    const determine_constants = () =>{
        if(endpoint == "users"){
            setDisplayValues(["first_name", "email"])
            setExcluded(["id", "cash", "buying_power", "completed_transactions", "submitted_transactions", "stock", "externaltransfer_set", "stockbalance_set"])
        } else if(endpoint == "stocks") {
            setDisplayValues(["ticker", "company_name"])
            setExcluded(["id", "market_price", "transaction_set"])
        }
    }

    const toggle = () => {
        setModal(!modal)
    }

    const toggleTransactions = () => {
        setTransactionModal(!transactionModal)
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
    };

    const determineToggle = () => {
        console.log(error_messages)
        getItemData();
        toggle();
    };

    const determineTransactionToggle = () => {
        console.log(error_messages)
        getItemData();
        toggleTransactions();
    };

    const handleDelete = (item) => {
        axios
          .delete(`/api/${endpoint}/${item.id}/`)
          .then((res) => getItemData());
    };

    const handleTransactionDelete = (item) => {
        axios
          .delete(`/api/transactions/${item.id}/`)
          .then((res) => getItemData());
    };

    const editItem = (item) => {
        /*
        if(endpoint == "transactions"){
            setDisplayValues(["from_username", "bid", "to_username", "stock_ticker", "price", "quantity"])
            setExcluded(["id", "from_username", "to_username", "stock_ticker", "stock_company_name"])
        }
        */
        // handle editing transactions from here


        setActiveItem(item)
        setModal(!modal)
    };

    const editTransaction = (item) => {
        const temp = {...item}
        if (item.bid == "Sell") {
            temp.bid = "false"
        } else if (item.bid == "Bid") {
            temp.bid = "true"
        }
        setActiveItem(temp)
        setTransactionModal(!transactionModal)
    }

    const saveTransaction = (item) => {
        setErrorMessages({})
        if (item.id) {
            console.log("about to update")
            axios
                .put(`/api/transactions/${item.id}/`, item)
                .then((res) => determineTransactionToggle())
                .catch((err) => {
                  setErrorMessages(err.response.data)
                  console.log("error", err)
                  return
                });
        }
    }

    const getItemData = () => {
      axios
          .get(`/api/${endpoint}/${item_id}`)
          .then((res) => setItem( res.data ))
          .catch((err) => console.log(err));
    };

    const getOptions = (endpoint) => {
        // gets all variables for this endpoint from api, along with data types,
        // valid choices and user-friendly names
        axios.options(`/api/${endpoint}/`)
            .then((res) => {
                setOptions(res.data.actions.POST)
                console.log(res.data.actions.POST)
            });
        axios.options(`/api/transactions/`)
            .then((res) => {
                setTransactionOptions(res.data.actions.POST)
                console.log(res.data.actions.POST)
            });
    }

    const getListOptions = () => {
        const temp = {};
        ["transactions", "stockbalances", "externaltransfers"].map((list_endpoint) => {
            axios.options(`/api/${list_endpoint}/`)
            .then((res) => {
                temp[list_endpoint] = res.data.actions.POST
                // setListOptions({...listOptions, [list_endpoint] : res.data.actions.POST})
                setListOptions({...listOptions, ...temp});
            });
        });
    }

    const getListDisplayData = (item, endpoint) => {
        // what the link text should be for this item
        // (item 1) - (item 2) - (item 3)
        return listDisplayValues[endpoint].map((key, i, arr) =>
                            <td key = {key}>
                                {
                                    // link on first item
                                    (i == 20) // disable link for now
                                        ?
                                            (
                                            <Link to = {`/${endpoint}/${item.id}`}>
                                                {item[key]}
                                            </Link>
                                            )
                                        : item[key]
                                }
                            </td>
                        )
    }

    const getTransactionDisplay = (transaction, endpoint, endpoint_mapping) => {
        return transaction.map((item, i) => (
            <tr key={item.id}>
                { getListDisplayData(item, endpoint_mapping[endpoint]) }
                <td>
                    {
                    // prevent some items from being edited (stockbalances, external transfers, completed transactions)
                        (
                            ((endpoint_mapping[endpoint] === "transactions") && (item["to_user"] == null))
                        ) ?
                            (
                              <button
                                onClick = {() => editTransaction(item)}
                              >
                                Edit
                              </button>
                            )
                        : (<span></span>)
                    }
                    {
                    // prevent some items from being deleted (stockbalances, external transfers, completed transactions)
                        (
                            ((endpoint_mapping[endpoint] === "transactions") && (item["to_user"] == null))
                        ) ?
                            (
                              <button
                                onClick = {() => handleTransactionDelete(item)}
                              >
                                Delete
                              </button>
                            )
                        : (<span></span>)
                    }
                </td>
            </tr>
        ))
    }

    const getUserDisplay = (user) => {
        /*
            if users,
                show associated stock if any
                show submitted transactions
                completed transactions
                external transfers
                stock balances
        */
        console.log(user)
        const getStock = () =>{
            if (user.stock.length !== 0){
                return (
                    <h3>Owner of
                        <Link to = {`/stocks/${user.stock[0].id}`}>
                            {` ${user.stock[0].ticker} (${user.stock[0].company_name})`}
                        </Link>
                    </h3>
                )
            } else {
                return null
            }
        }

        const endpoint_mapping = {
            "completed_transactions": "transactions",
            "submitted_transactions": "transactions",
            "externaltransfer_set": "externaltransfers",
            "stockbalance_set": "stockbalances"
        }

        return(
            <div>
                <h2>{`${user.first_name} ${user.last_name}`}</h2>
                { getStock() }
                <h3> Buying power: ${user.buying_power} (from ${user.cash} total)</h3>
                {
                    ["completed_transactions", "submitted_transactions", "externaltransfer_set", "stockbalance_set"].map((endpoint) =>
                        <table>
                            <thead>
                                <tr>
                                    <h4>{ endpoint }</h4>
                                </tr>
                                <tr>
                                    {
                                        listDisplayValues[endpoint_mapping[endpoint]].map((item, i) =>
                                            <td key = {item}>
                                                {
                                                    // prevents errors as it will try to load the state variable before it is set
                                                    (Object.keys(listOptions[endpoint_mapping[endpoint]]).length !== 0)
                                                        ? listOptions[endpoint_mapping[endpoint]][item]["label"]
                                                        : "Loading"
                                                }
                                            </td>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {getTransactionDisplay(user[endpoint], endpoint, endpoint_mapping)}
                            </tbody>
                        </table>
                    )
                }
            </div>
        )
    }

    const getStockDisplay = (stock) => {
        /*
            if stock,
            show associated user
            show transactions
            show stock balances

        */
        console.log(stock)

        const endpoint_mapping = {
            "transaction_set": "transactions",
            "stockbalance_set": "stockbalances"
        }

        return(
            <div>
                <h2>{`${stock.company_name} (${stock.ticker})`}</h2>
                <h3> Owned by {
                    <Link to = {`/users/${stock.owner}`}>
                            user #{stock.owner}
                    </Link>
                }
                </h3>
                {
                    ["transaction_set", "stockbalance_set"].map((endpoint) =>
                        <table>
                            <thead>
                                <tr>
                                    <h4>{ endpoint }</h4>
                                </tr>
                                <tr>
                                    {
                                        listDisplayValues[endpoint_mapping[endpoint]].map((item, i) =>
                                            <td key = {item}>
                                                {
                                                    // prevents errors as it will try to load the state variable before it is set
                                                    (Object.keys(listOptions[endpoint_mapping[endpoint]]).length !== 0)
                                                        ? listOptions[endpoint_mapping[endpoint]][item]["label"]
                                                        : "Loading"
                                                }
                                            </td>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {getTransactionDisplay(stock[endpoint], endpoint, endpoint_mapping)}
                            </tbody>
                        </table>
                    )
                }
            </div>
        )
    }

    useEffect(() => {
        getOptions(endpoint);
        determine_constants();
        getItemData();
        document.title = `${endpoint} #${item_id}`;
        determine_list_display();
        getListOptions();
    }, [props.match.params.endpoint, props.match.params.item_id]);

    return(
        <div>
            {modal ? (
                // editing active item
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
            {transactionModal ? (
              <DjangoModal
                // editing tranactions
                activeItem={activeItem}
                toggle={toggleTransactions}
                onSave={saveTransaction}
                errors={error_messages}
                endpoint={"transactions"}
                excluded={transactionExcludedFields}
                options = {transactionOptions}
              />
            ) : null}
            {
                (endpoint == "users" && item.length !== 0)
                ? getUserDisplay(item)
                : null
            }
            {
                (endpoint == "stocks" && item.length !== 0)
                ? getStockDisplay(item)
                : null
            }
            {
                (
                  <button
                    onClick = {() => editItem(item)}
                  >
                    Edit
                  </button>
                )
            }
            {
                (
                  <button
                    onClick = {() => handleDelete(item)}
                  >
                    Delete
                  </button>
                )
            }
        </div>
    );
}

export default Detail