# inject-epic-reducers
simple injection wrapper for reducers and epics in React



### Installation

create your reducers 
```
export const rootReducer = (asyncReducers) => combineReducers({
  reducer: reducer,
  ...asyncReducers
});
```

or with Redux-persist 

```
export const rootReducer = (asyncReducers) => persistReducer(persistConfig, combineReducers({
   reducer: reducer,
  ...asyncReducers
}));
```

if using  epics 
```
const rootEpics = combineEpics(
  importedEpic,
  anotherEpic
)

export const epic$ = new BehaviorSubject(rootEpics);

export const rootEpic = (action$, store) =>
  epic$.mergeMap(epic =>
    epic(action$, store)
  );

```

Then configure your store 
```
import rootReducer, { rootEpic, epic$ } from '../above';

const createStore = (initialState = {}) => {
  const middleware = [
    createEpicMiddleware(rootEpic)
  ];
  {...the regular stuff }
  
  const store = createReduxStore(
    rootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers,
    ),
  );
  
  // these are the important stuff, needed for adding reducers
  store.asyncReducer = {};
  store.rootReducers = rootReducer;
  // new epics if you use them
  store.epics = epic$;
};
```

### exporting a reducer and/or epic 

The package is looking for exports named epic and reducer, so your exported reduxer/epic must follow: 
```
  export const reducer = someReducer;
  export const epic = combineEpics(localEpicOne, localEpicTwo);
 ```


For usage with for example api calls check [Injecting Dependencies Into Epics](https://redux-observable.js.org/docs/recipes/InjectingDependenciesIntoEpics.html)
