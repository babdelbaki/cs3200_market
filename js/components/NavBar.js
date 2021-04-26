import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

const NavBar = (props) =>{
    const display_links = ["Users", "Stocks", "Transactions", "Stock Balances", "External Transfers"]
    
    const link_paths = display_links.map(display_name=>
        // turn display names into link paths
        `/market/${display_name.replace(/\s+/g, '').toLowerCase()}`
    )
    
    return (
        <div>
            <Nav tabs>
                {
                    display_links.map((display_name, index) =>(
                        <NavItem>
                            <NavLink href = {link_paths[index]} 
                                active = { 
                                    (window.location.pathname == link_paths[index]) 
                                     ? (true)
                                     : (false)
                                }
                                >
                                {display_name}
                            </NavLink>
                        </NavItem>
                    ))
                }
            </Nav>
        </div>
    )
}

export default NavBar