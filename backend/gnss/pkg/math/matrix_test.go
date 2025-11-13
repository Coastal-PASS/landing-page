package mathx

import (
	"testing"

	"gonum.org/v1/gonum/mat"
)

func TestInvert(t *testing.T) {
	m := mat.NewDense(2, 2, []float64{
		4, 7,
		2, 6,
	})
	inv, err := Invert(m)
	if err != nil {
		t.Fatalf("invert: %v", err)
	}
	if inv.At(0, 0) == 0 {
		t.Fatalf("unexpected inverse result")
	}
}
