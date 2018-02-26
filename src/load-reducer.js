const React = require('react');
const PropTypes = require('prop-types');

const injectReducer = (store, key, reducer) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;
  store.asyncReducers[key] = reducer; // eslint-disable-line
  store.replaceReducer(store.rootReducers(store.asyncReducers));
};


/**
 * Dynamically injects a reducer
 *
 * @param {string} moduleProvider an import promise.
 * @param {function} key, the key that the reducer will be mapped to.
 *
 */
export const LoadReducer = (moduleProvider, key) => (WrappedComponent) => {
  class ReducerInjector extends React.PureComponent {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };
    displayName =
    `withReducer(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;
    constructor(props, context) {
      super(props, context);

      this.state = {
        loaded: false
      };
    }

    componentWillMount() {
      if (!this.state.Component) {

        moduleProvider().then(({reducer, epic}) => {
          injectReducer(this.context.store, key, reducer);

          if (epic && this.context.store.epics) {
            this.context.store.epics.next(epic);
          }
          this.setState({ loaded: true });

        });
      }
    }

    render() {
      if (this.state.loaded) { return <WrappedComponent {...this.props}/>; }
      return null;
    }
  }

  return ReducerInjector;
};
