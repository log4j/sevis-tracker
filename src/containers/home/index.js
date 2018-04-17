import React from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { login, updateEmail, updatePassword } from "../../modules/user";

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
  }

  handleEmailChange(event) {
    this.props.updateEmail(event.target.value);
  }

  handlePasswordChange(event) {
    this.props.updatePassword(event.target.value);
  }

  handleSubmit() {
    const { email, password } = this.props;
    this.props.login({ email, password });
  }

  render() {
    const { data } = this.props;
    console.log(this.props);
    return (
      <div>
        {!data && this.showLogin()}
        {data && this.showData()}
      </div>
    );
  }

  showLogin = () => {
    const { email, password } = this.props;

    return (
      <div>
        <div className="email">
          <input value={email} onChange={this.handleEmailChange} />
        </div>
        <div className="password">
          <input value={password} onChange={this.handlePasswordChange} />
        </div>
        <div className="action">
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  };

  showData = () => {
    const { data } = this.props;
    let employers = (data.employmentAuthorizations || []).reduce(
      (all, item) => {
        (item.employers || []).forEach(em => {
          all.push(em);
        });
        return all;
      },
      []
    );
    employers = employers.sort((a, b) => {
      return a.sevisEmployerId < b.sevisEmployerId;
    });
    return (
      <div>
        <p>
          {" "}
          {data.givenName} {data.surName}{" "}
        </p>
        <div>
          {employers.map(item => (
            <div>
              <p>
                <span>Employer</span> {item.name}
              </p>
              <p>
                <span>Start</span> <DateSpan date={item.startDate} />
              </p>
              <p>
                <span>End</span> <DateSpan date={item.endDate} />
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  email: state.user.email,
  password: state.user.password,
  user: state.user.user,
  data: state.user.data,
  loading: state.user.loading,
  error: state.user.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login,
      updateEmail,
      updatePassword,
      changePage: () => push("/about-us")
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
