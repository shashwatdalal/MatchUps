import React, {Component} from 'react';
import FixtureList from './FixtureList';
import Matchmaking from '../Matchmaking/Matchmaking';
import {Nav, NavItem} from 'react-bootstrap';

class TeamRightPanel extends Component {

  state = {
    active_key: "1"
  }

  handleSelect(key) {
    this.setState({
      active_key: key
    })
  }


  render() {
    var _this = this
    return (
      <div>
        <Nav bsStyle="tabs" activeKey={this.state.active_key} onSelect={k => this.handleSelect(k)}>
          <NavItem eventKey="1" title="Matchmaking">
            Create A Fixture
          </NavItem>
          <NavItem eventKey="2" title="Fixtures">
            View Fixtures
          </NavItem>
          </Nav>
           {(_this.state.active_key === "1") ? <Matchmaking team_id={_this.props.team_id}/>
                                : <FixtureList team_id={_this.props.team_id}/>}
        </div>
      );
    }
}

export default TeamRightPanel;
