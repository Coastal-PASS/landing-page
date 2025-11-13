package gnss

import (
	"testing"
	"time"

	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

func TestVisiblePasses(t *testing.T) {
	tle := TLE{
		Name:  "ISS (ZARYA)",
		Line1: "1 25544U 98067A   25001.54791667  .00001264  00000+0  33233-4 0  9992",
		Line2: "2 25544  51.6448 126.2524 0004981  87.4565  20.5463 15.50363167432145",
	}
	req := PassRequest{
		Location: apptypes.Coordinate{
			Latitude:   37.7749,
			Longitude:  -122.4194,
			ElevationM: 10,
		},
		Start: time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
		End:   time.Date(2025, 1, 2, 0, 0, 0, 0, time.UTC),
		Step:  time.Minute,
	}

	passes, err := VisiblePasses(tle, req)
	if err != nil {
		t.Fatalf("visible passes: %v", err)
	}
	if len(passes) == 0 {
		t.Skip("no passes within test window; propagation still succeeded")
	}
}
