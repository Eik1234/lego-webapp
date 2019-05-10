// @flow

import { Joblistings } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';

export default createEntityReducer({
  key: 'joblistings',
  types: {
    fetch: Joblistings.FETCH,
    mutate: Joblistings.CREATE,
    delete: Joblistings.DELETE
  }
});

export const selectJoblistings = createSelector(
  state => state.joblistings.byId,
  state => state.joblistings.items,
  (joblistingsById, joblistingIds) =>
    joblistingIds.map(id => joblistingsById[id])
);

export const selectJoblistingById = createSelector(
  state => state.joblistings.byId,
  (state, props) => props.joblistingId,
  (joblistingsById, joblistingId) => joblistingsById[joblistingId]
);
