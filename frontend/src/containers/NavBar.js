import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
            as={ Link }
            to='/profile'
          />
          <Menu.Item
            name='areas'
            active={activeItem === 'areas'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='edit profile'
            active={activeItem === 'edit profile'}
            onClick={this.handleItemClick}
            as={ Link }
            to='/profile/edit'
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='logout'
              active={activeItem === 'logout'}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu>

      </div>
    )
  }
}