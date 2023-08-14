/*
  0 - name
  1 - description
  2 - cost (array where first index is array index to resource and second index is value)
  3 - prereqs
  4 - number built
  5 - num clicked
  6 - hidden
  7 - disabled
*/
const buildings = [
  // 0
  [
    'Ritual Circle',
    'Increases skeleton capacity by 4',
    [
      [0, 50],
      [1, 25]
    ]
  ]
];
export default buildings;