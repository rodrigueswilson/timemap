function exposeTestFunctionNames() {
    return [
        'testDatasetIsDefined',
        'testItemLoaded',
        'testItemLoadedInEventSource',
        'testEarliestDate',
        'testLatestDate',
        'testItemAttributes'
    ];
}

function testDatasetIsDefined() {
    assertNotUndefined("dataset is defined", tm.datasets["test"]);
}

function testItemLoaded() {
    var ds = tm.datasets["test"];
    assertEquals("one item in item array", ds.getItems().length, 1);
}

function testItemLoadedInEventSource() {
    var ds = tm.datasets["test"];
    assertEquals("one item in eventSource", ds.eventSource.getCount(), 1);
}

function testEarliestDate() {
    var ds = tm.datasets["test"];
    assertEquals("year matches", ds.eventSource.getEarliestDate().getUTCFullYear(), 1980);
    assertEquals("month matches", ds.eventSource.getEarliestDate().getUTCMonth(), 0);
    assertEquals("day matches", ds.eventSource.getEarliestDate().getUTCDate(), 2);
}

function testLatestDate() {
    var ds = tm.datasets["test"];
    assertEquals("year matches", ds.eventSource.getLatestDate().getFullYear(), 2000);
    assertEquals("month matches", ds.eventSource.getEarliestDate().getMonth(), 0);
    assertEquals("day matches", ds.eventSource.getEarliestDate().getUTCDate(), 2);
}

function testItemAttributes() {
    var items = tm.datasets["test"].getItems();
    var item = items[0];
    assertEquals("title matches", item.getTitle(), "Test Event");
    assertEquals("placemark type matches", item.getType(), "marker");
    var point = new GLatLng(23.456, 12.345);
    assertTrue("point matches", item.getInfoPoint().equals(point));
}