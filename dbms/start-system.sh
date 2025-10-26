#!/bin/bash

echo "🚀 Starting Enhanced Course Registration System"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Start the backend server
echo "🔧 Starting backend server..."
cd "$(dirname "$0")"
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB..."
sleep 2

# Check if backend is running
if curl -s http://localhost:5001 > /dev/null; then
    echo "✅ Backend server is running on http://localhost:5001"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Seed courses if database is empty
echo "🌱 Checking if courses need to be seeded..."
sleep 1
node seed-courses.js > /dev/null 2>&1 &
echo "✅ Courses checked/seeded"

# Start the React client
echo "🔧 Starting React client..."
cd react-client

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing React dependencies..."
    npm install
fi

# Start React development server
npm start &
REACT_PID=$!

echo ""
echo "🎉 System is starting up!"
echo "========================="
echo "Backend Server: http://localhost:5001"
echo "GraphQL Playground: http://localhost:5001/graphql"
echo "React App: http://localhost:3000"
echo ""
echo "📋 Available Features:"
echo "- Real-Time Enrollment: http://localhost:3000/realTimeEnrollment"
echo "- GraphQL Client: http://localhost:3000/graphql"
echo "- Analytics Dashboard: http://localhost:3000/analytics"
echo ""
echo "🛑 To stop the servers, press Ctrl+C"

# Wait for user to stop
wait
