#!/bin/bash

# Run migrations for applicant tracking system
# Usage: ./run-migrations.sh <database_url>
# Example: ./run-migrations.sh "postgres://user:pass@localhost:5432/applicant_tracking"

if [ -z "$1" ]; then
    echo "Usage: ./run-migrations.sh <database_url>"
    echo "Example: ./run-migrations.sh \"postgres://user:pass@localhost:5432/applicant_tracking\""
    exit 1
fi

DATABASE_URL=$1

echo "Running schema migration..."
psql "$DATABASE_URL" -f ./migrations/001_add_enhanced_schema.sql

if [ $? -eq 0 ]; then
    echo "Schema migration completed successfully!"
else
    echo "Schema migration failed!"
    exit 1
fi

echo ""
echo "Running seed data..."
psql "$DATABASE_URL" -f ./migrations/002_seed_sample_data.sql

if [ $? -eq 0 ]; then
    echo "Seed data inserted successfully!"
else
    echo "Seed data insertion failed!"
    exit 1
fi

echo ""
echo "All migrations completed successfully!"
