package helpers

func CheckIfKeyInMap(key string, m map[string]string) bool {
	_, ok := m[key]
	return ok
}