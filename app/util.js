export function compareOwnedBy(a,b) {
  if(a.ownedBy.length < b.ownedBy.length)
    return 1;
  else if(a.ownedBy.length > b.ownedBy.length)
    return -1;
  else {
    return 0;
  }
}
