module("Point Tests");

test("test constructor", 2, function() {

  var pt = new Point(7, 3);

  equal(7, pt.x, "Expect x coord on (7, 3) to be 7");
  equal(3, pt.y, "Expect y coord on (7, 3) to be 3");
});

test("test isAdjacent", 3, function() {

  var pt11 = new Point(1, 1);
  var pt12 = new Point(1, 2);
  var pt22 = new Point(2, 2);

  equal(true, pt11.isAdjacent(pt12), "Expect (1,1) and (1,2) to be adjacent");
  equal(true, pt12.isAdjacent(pt22), "Expect (1,2) and (2,2) to be adjacent");
  equal(false, pt11.isAdjacent(pt22), "Expect (1,1) and (2,2) not to be adjacent");
});

test("test isValid", 5, function() {

  var invalid = new Point(-1, 5);
  var invalid2 = new Point(12, 5);
  var invalid3 = new Point(-3, 14);
  var valid = new Point(5, 5);
  var valid2 = new Point(2, 4);

  equal(false, invalid.isValid(), "Expect (-1, 5) to be invalid");
  equal(false, invalid2.isValid(), "Expect (12, 5) to be invalid");
  equal(false, invalid3.isValid(), "Expect (-3, 14) to be invalid");
  equal(true, valid.isValid(), "Expect (5, 5) to be valid");
  equal(true, valid2.isValid(), "Expect (2, 4) to be valid");
});

test("test isEqual", 4, function() {

  var valid = new Point(5, 5);
  var validcopy = new Point(5, 5);
  var valid2 = new Point(2, 4);
  var valid2copy = new Point(2, 4);

  equal(true, valid.isEqual(validcopy), "Two points at (5, 5) should be equal");
  equal(true, validcopy.isEqual(valid), "Two points at (5, 5) should be equal");
  equal(true, valid2.isEqual(valid2copy), "Two points at (2, 4) should be equal");
  equal(true, valid2copy.isEqual(valid2), "Two points at (2, 4) should be equal");
});

test("test adjacentPoints", 5, function() {

  var corner = new Point(10, 0);
  var norm = new Point(5, 5);
  var normAdj = norm.adjacentPoints();

  var pt54 = false;
  var pt56 = false;
  var pt45 = false;
  var pt65 = false;
  for (var i = 0; i < normAdj.length; i++) {
    if (normAdj[i].isEqual(new Point(5, 4))) {
      pt54 = true;
    }
    if (normAdj[i].isEqual(new Point(5, 6))) {
      pt56 = true;
    }
    if (normAdj[i].isEqual(new Point(4, 5))) {
      pt45 = true;
    }
    if (normAdj[i].isEqual(new Point(6, 5))) {
      pt65 = true;
    }
  }

  equal(2, corner.adjacentPoints().length, "(10, 0) should have two adjacentPoints");
  equal(true, pt54, "(5, 4) should be adjacent to (5, 5)");
  equal(true, pt56, "(5, 6) should be adjacent to (5, 5)");
  equal(true, pt45, "(4, 5) should be adjacent to (5, 5)");
  equal(true, pt65, "(6, 5) should be adjacent to (5, 5)");
});

test("test getOppositeAdjacentPoint", 4, function() {
  var norm = new Point(5, 5);
  var adj1 = new Point(4, 5);
  var adj2 = new Point(6, 5);

  var edge = new Point(0, 0);
  var edgeAdj = new Point(0, 1);
  var edgeNonAdj = new Point(1, 1);

  equal(true, adj2.isEqual(norm.getOppositeAdjacentPoint(adj1)), "(6, 5) should be the opposite adjacent point around (5, 5) for (4, 5)")
  equal(true, adj1.isEqual(norm.getOppositeAdjacentPoint(adj2)), "(4, 5) should be the opposite adjacent point around (5, 5) for (6, 5)")
  equal(false, edge.getOppositeAdjacentPoint(edgeAdj), "There should be no adjacent point around (0, 0) for (0, 1)")
  equal(false, edge.getOppositeAdjacentPoint(edgeNonAdj), "There should be no adjacent point around (0, 0) for (1, 1)")
});

test("test isEdge", 3, function() {
  var edge = new Point(0, 0);
  var edge2 = new Point(5, 10);
  var notEdge = new Point(3, 4);

  equal(true, edge.isEdge(), "(0, 0) should be a edge");
  equal(true, edge2.isEdge(), "(5, 10) should be a edge");
  equal(false, notEdge.isEdge(), "(3, 4) should not be a edge");
});

test("test isCorner", 3, function() {
  var corner = new Point(0, 0);
  var corner2 = new Point(0, 10);
  var notCorner = new Point(3, 4);

  equal(true, corner.isCorner(), "(0, 0) should be a corner");
  equal(true, corner2.isCorner(), "(0, 10) should be a corner");
  equal(false, notCorner.isCorner(), "(3, 4) should not be a corner");
});

test("test isCenter", 2, function() {
  var center = new Point(5, 5);
  var notCenter = new Point(3, 4);

  equal(true, center.isCenter(), "(5, 5) should be the center");
  equal(false, notCenter.isCenter(), "(3, 4) should not be the center");
});