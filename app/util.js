export function compareOwnedBy(a,b) {
  if(a.ownedBy.length < b.ownedBy.length)
    return 1;
  else if(a.ownedBy.length > b.ownedBy.length)
    return -1;
  else {
    return 0;
  }
}

export function removeUniqueGames(arr2) {
  var arr = arr2;
  
  return arr;
}
