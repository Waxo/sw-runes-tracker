const R = requireNode('ramda');

const propIsNil_ = prop => R.pipe(R.prop(prop), R.isNil);
const prepareMerge_ = trackerDB => R.pipe(R.of, R.prepend(trackerDB));

const isInRunesToDelete_ = deletionList =>
  R.pipe(R.prop('rune_id'), R.includes(R.__, deletionList));

const removeSoldRunes_ = (trackerDB, runesList) => {
  const trackerDBId = R.pluck('rune_id', trackerDB);
  const runesListId = R.pluck('rune_id', runesList);

  const deletionList = R.difference(trackerDBId, runesListId);
  return R.reject(isInRunesToDelete_(deletionList), trackerDB);
};

const mergeRunesAndTracker_ = R.pipe(
  R.map(R.indexBy(R.prop('rune_id'))),
  R.reduce(R.mergeWith(R.mergeDeepRight), {}),
  R.values
);

const updateFirstSeenRunes_ = R.map(
  R.when(propIsNil_('firstSeen'), R.assoc('firstSeen', new Date()))
);

const updateUsage_ = R.pipe(
  R.converge(R.over(R.lensProp('oldLocations')), [
    R.pipe(R.prop('currentLocation'), R.append),
    R.identity
  ]),
  R.over(R.lensProp('lastUsage'), () => new Date())
);

const updateMonsterRunes_ = R.curry((monsterName, trackerDB) =>
  R.map(
    R.when(R.propEq('currentLocation', monsterName), updateUsage_),
    trackerDB
  )
);

const bulkUpdateMonstersRunes = R.curry((monsterList, trackerDB) =>
  (monsterList.length === 0) ?
    trackerDB :
    bulkUpdateMonstersRunes(
      R.tail(monsterList),
      updateMonsterRunes_(R.head(monsterList), trackerDB)
    )
);

const mergeCurrentRunesWithDatabase = R.curry((trackerDB, runesList) => {
  const filteredTrackerDB = removeSoldRunes_(trackerDB, runesList);
  return R.pipe(
    prepareMerge_(filteredTrackerDB),
    mergeRunesAndTracker_,
    updateFirstSeenRunes_
  )(runesList);
});

export {
  mergeCurrentRunesWithDatabase,
  bulkUpdateMonstersRunes
};
