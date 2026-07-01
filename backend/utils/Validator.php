<?php
// agrinexus-api/utils/Validator.php

class Validator {
    private array $errors = [];
    private array $data;

    public function __construct(array $data) {
        $this->data = $data;
    }

    public function required(string $field): static {
        if (empty($this->data[$field])) {
            $this->errors[] = "$field is required";
        }
        return $this;
    }

    public function email(string $field): static {
        if (!empty($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "$field must be a valid email address";
        }
        return $this;
    }

    public function min(string $field, int $length): static {
        if (!empty($this->data[$field]) && strlen($this->data[$field]) < $length) {
            $this->errors[] = "$field must be at least $length characters";
        }
        return $this;
    }

    public function max(string $field, int $length): static {
        if (!empty($this->data[$field]) && strlen($this->data[$field]) > $length) {
            $this->errors[] = "$field must not exceed $length characters";
        }
        return $this;
    }

    public function in(string $field, array $values): static {
        if (!empty($this->data[$field]) && !in_array($this->data[$field], $values, true)) {
            $this->errors[] = "$field must be one of: " . implode(', ', $values);
        }
        return $this;
    }

    public function numeric(string $field): static {
        if (!empty($this->data[$field]) && !is_numeric($this->data[$field])) {
            $this->errors[] = "$field must be a number";
        }
        return $this;
    }

    public function fails(): bool {
        return count($this->errors) > 0;
    }

    public function errors(): array {
        return $this->errors;
    }
}
