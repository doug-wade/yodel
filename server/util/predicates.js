module.exports = {
  existsAndIncludes: function(/* String */ toCheck, /* String */ includes) {
    if (!toCheck) {
      return false;
    } else if (toCheck.toLowerCase().includes(includes.toLowerCase())) {
      return true;
    }
    return false;
  }
};
