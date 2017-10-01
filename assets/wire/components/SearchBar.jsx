import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { gettext } from 'utils';
import { setQuery } from 'wire/actions';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {query: props.query || ''};
    }

    onChange(event) {
        this.setState({query: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.setQuery(this.state.query);
        this.props.fetchItems().then(() => {
            // update browser url - where should this go?
            const params = new URLSearchParams(window.location.search);
            params.set('q', this.state.query);
            history.pushState(this.props.state, null, '?' + params.toString());
        });
    }

    render() {
        return (
            <form className="form-inline" onSubmit={this.onSubmit}>
                <input type="text"
                    name="q"
                    className="form-control mr-sm-2"
                    value={this.state.query}
                    onChange={this.onChange}
                />
                <button className="btn btn-outline-success my-2 my-sm-0"
                    type="submit">{gettext('Search')}</button>
            </form>
        );
    }
}

SearchBar.propTypes = {
    query: PropTypes.string,
    setQuery: PropTypes.func,
    fetchItems: PropTypes.func,
    state: PropTypes.object,
};

const mapStateToProps = (state) => ({
    query: state.activeQuery,
    state: state,
});

const mapDispatchToProps = (dispatch) => ({
    setQuery: (query) => dispatch(setQuery(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
