import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import FaGithub from "react-icons/lib/fa/github";

import {
  login,
  logout,
  updateEmail,
  updatePassword,
  fetchInformation
} from "../../modules/user";

const DateSpan = props => {
  if (props && props.date) {
    const date = new Date(props.date);
    return (
      <span className="date">
        {date.getUTCFullYear()}/{date.getUTCMonth() + 1}/{date.getUTCDate()}
      </span>
    );
  } else {
    return "";
  }
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleEmailChange(event) {
    this.props.updateEmail(event.target.value);
  }

  handlePasswordChange(event) {
    this.props.updatePassword(event.target.value);
  }

  handleSubmit(event) {
    const { email, password } = this.props;
    this.props.login(email, password);
    event.preventDefault();
  }

  handleRefresh() {
    const { user, token } = this.props;
    this.props.fetchInformation(user, token);
  }

  render() {
    return (
      <div>
        {this.showLoading()}
        {this.showLogin()}
        {this.showData()}
        {this.showRefreshButton()}
        {this.showError()}
        {this.showFooter()}
      </div>
    );
  }

  showLogin = () => {
    const { email, password, data, token } = this.props;
    if (data || token) {
      return null;
    }
    return (
      <div className="form">
        <form onSubmit={this.handleSubmit}>
          <div>
            <h4> Login with you SEVP account </h4>
          </div>
          <div className="email">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={this.handleEmailChange}
            />
          </div>
          <div className="password">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div className="action">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  };

  showData = () => {
    const { name, data } = this.props;

    let eads = (data && data.employmentAuthorizations) || [];
    eads = eads.sort((a, b) => a.sevisEmploymentId < b.sevisEmploymentId);
    eads.forEach(item => {
      item.employers = item.employers.sort((a, b) => {
        return a.sevisEmployerId < b.sevisEmployerId;
      });
    });

    return (
      <div>
        {name && (
          <div className="title">
            <h3>
              <button className="btn-logout" onClick={this.props.logout}>
                Logout
              </button>
              {name}
            </h3>
          </div>
        )}
        <div>
          {eads.map((ead, eIndex) => (
            <div key={ead.sevisEmploymentId} className="record">
              <h3>
                EAD#{eads.length - eIndex} <DateSpan date={ead.startDate} /> -{" "}
                <DateSpan date={ead.endDate} />
              </h3>
              <table>
                {ead.employers.map((item, index) => (
                  <tbody key={item.sevisEmployerId}>
                    <tr>
                      <th>Employer #{ead.employers.length - index}</th>
                      <td>{item.name}</td>
                    </tr>
                    <tr>
                      <th>Start</th>
                      <td>
                        <DateSpan date={item.startDate} />
                      </td>
                    </tr>
                    <tr>
                      <th>End</th>
                      <td>
                        <DateSpan date={item.endDate} />
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          ))}

          {name &&
            eads.length === 0 && <p className="tip">Click Refresh to update</p>}
        </div>
      </div>
    );
  };

  showRefreshButton = () => {
    const { user, token } = this.props;
    if (user && token) {
      return (
        <div className="reload-btn">
          <button onClick={this.handleRefresh}>Refresh</button>
        </div>
      );
    } else {
      return null;
    }
  };

  showError = () => {
    const { error } = this.props;
    if (error) {
      return (
        <p>
          <span className="error">{error}</span>
        </p>
      );
    } else {
      return null;
    }
  };

  showLoading = () => {
    const { loading } = this.props;
    if (loading) {
      return (
        <div className="loading">
          <div className="loader" />
        </div>
      );
    } else {
      return null;
    }
  };

  showFooter = () => {
    return (
      <div className="footer">
        <span>
          Open Source on{" "}
          <FaGithub style={{ verticalAlign: "middle", marginBottom: "2px" }} />
          <a href="https://github.com/log4j/sevis-tracker" target="_blank">
            Github
          </a>
        </span>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  email: state.user.email,
  password: state.user.password,
  user: state.user.user,
  name: state.user.name,
  data: state.user.data,
  token: state.user.token,
  loading: state.user.loading,
  error: state.user.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login,
      logout,
      updateEmail,
      updatePassword,
      fetchInformation
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
