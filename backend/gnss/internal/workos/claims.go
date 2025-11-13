package workos

// Claims represents the WorkOS JWT claims relevant to GNSS authorization.
type Claims struct {
	UserID      string
	OrgID       string
	SessionID   string
	Permissions []string
	Roles       []string
	Email       string
}

// HasPermission checks if a claim contains the provided permission.
func (c Claims) HasPermission(perm string) bool {
	for _, p := range c.Permissions {
		if p == perm {
			return true
		}
	}
	return false
}

// HasRole checks membership in the provided role list.
func (c Claims) HasRole(role string) bool {
	for _, r := range c.Roles {
		if r == role {
			return true
		}
	}
	return false
}
