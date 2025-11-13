package mathx

import (
	"fmt"

	"gonum.org/v1/gonum/mat"
)

// Invert computes the inverse of the provided square matrix.
func Invert(m mat.Matrix) (*mat.Dense, error) {
	var inv mat.Dense
	if err := inv.Inverse(m); err != nil {
		return nil, fmt.Errorf("matrix singular: %w", err)
	}
	return &inv, nil
}

// TransposeMultiply returns A^T * A for the provided matrix.
func TransposeMultiply(m mat.Matrix) *mat.Dense {
	_, c := m.Dims()
	result := mat.NewDense(c, c, nil)
	result.Mul(m.T(), m)
	return result
}
