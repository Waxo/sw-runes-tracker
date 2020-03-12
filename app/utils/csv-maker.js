import moment from 'moment';

const R = requireNode('ramda');

const updater_ = ([idx, value], init) => R.update(idx - 1, value, init);

const secondaries_ = (subs, init) => {
  if (R.isNil(init)) {
    init = R.repeat('-', 12);
  }
  return R.length(subs) === 0
    ? R.join(',', init)
    : secondaries_(R.tail(subs), updater_(R.head(subs), init));
};

const runeToCSV_ = ({
  rune_id,
  firstSeen,
  lastUsage,
  oldLocations,
  currentLocation,
  star,
  set_id,
  pri_eff,
  prefix_eff,
  sec_eff
}) =>
  R.join(',', [
    rune_id,
    moment(firstSeen).format('YYYY-MM-DD'),
    moment(lastUsage).format('YYYY-MM-DD'),
    oldLocations ? R.join('-', oldLocations) : '',
    currentLocation,
    star,
    set_id,
    pri_eff,
    prefix_eff,
    secondaries_(sec_eff)
  ]);

const csvMaker = R.pipe(R.map(runeToCSV_), R.join('\n'));

export default csvMaker;
