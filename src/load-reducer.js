const React = require('react');
const PropTypes = require('prop-types');

const injectReducer = (store, key, reducer, epic) => {
  if (Object.hasOwnProperty.call(store.rootReducers(), key)) return;
  store.replaceReducer(store.rootReducers({[key]: reducer}));

  if (epic && store.epics) {
      store.epics.next(epic);
  }
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

    async componentWillMount() {
      const {reducer, epic} = await moduleProvider();
      injectReducer(this.context.store, key, reducer, epic);

      this.setState({ loaded: true });
    }

    render() {
      if (this.state.loaded) { return <WrappedComponent {...this.props}/>; }
      return null;
    }
  }

  return ReducerInjector;
};
