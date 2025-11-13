package providers

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

func parseTLEBody(body string, source string) ([]TLERecord, error) {
	lines := strings.Split(strings.TrimSpace(body), "\n")
	var records []TLERecord
	for i := 0; i < len(lines); {
		line := strings.TrimSpace(lines[i])
		if line == "" {
			i++
			continue
		}
		if !strings.HasPrefix(line, "0 ") && !strings.HasPrefix(line, "1 ") {
			name := line
			if i+2 >= len(lines) {
				break
			}
			line1 := strings.TrimSpace(lines[i+1])
			line2 := strings.TrimSpace(lines[i+2])
			norad, _ := strconv.Atoi(strings.TrimSpace(line1[2:7]))
			records = append(records, TLERecord{
				Name:       strings.TrimPrefix(name, "0 "),
				NORADID:    norad,
				Line1:      line1,
				Line2:      line2,
				Source:     source,
				CapturedAt: time.Now().UTC(),
			})
			i += 3
			continue
		}
		if strings.HasPrefix(line, "1 ") && i+1 < len(lines) {
			line1 := line
			line2 := strings.TrimSpace(lines[i+1])
			norad, _ := strconv.Atoi(strings.TrimSpace(line1[2:7]))
			records = append(records, TLERecord{
				Name:       fmt.Sprintf("NORAD-%d", norad),
				NORADID:    norad,
				Line1:      line1,
				Line2:      line2,
				Source:     source,
				CapturedAt: time.Now().UTC(),
			})
			i += 2
			continue
		}
		i++
	}
	if len(records) == 0 {
		return nil, fmt.Errorf("no TLE records parsed")
	}
	return records, nil
}
