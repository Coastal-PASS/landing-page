package providers

import "testing"

func TestParseTLEBody(t *testing.T) {
	body := `0 ISS (ZARYA)
1 25544U 98067A   25001.54791667  .00001264  00000+0  33233-4 0  9992
2 25544  51.6448 126.2524 0004981  87.4565  20.5463 15.50363167432145`

	records, err := parseTLEBody(body, "test")
	if err != nil {
		t.Fatalf("parse tle: %v", err)
	}
	if len(records) != 1 {
		t.Fatalf("expected 1 record, got %d", len(records))
	}
	if records[0].NORADID != 25544 {
		t.Fatalf("unexpected NORAD id: %d", records[0].NORADID)
	}
}
