#!/bin/bash

# Performance Analysis Script for Stefa.books
# Usage: ./scripts/analyze-performance.sh [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PORT=3000
HOST="http://localhost"
OUTPUT_DIR="performance-reports"
LIGHTHOUSE=true
BUNDLE_ANALYZE=true
PERFORMANCE_TESTS=true

# Help function
show_help() {
    echo "Performance Analysis Script for Stefa.books"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -p, --port PORT         Port number (default: 3000)"
    echo "  -o, --output DIR        Output directory (default: performance-reports)"
    echo "  --no-lighthouse         Skip Lighthouse analysis"
    echo "  --no-bundle             Skip bundle analysis"
    echo "  --no-tests              Skip performance tests"
    echo ""
    echo "Examples:"
    echo "  $0                      # Run all analyses"
    echo "  $0 -p 3001             # Use port 3001"
    echo "  $0 --no-lighthouse     # Skip Lighthouse"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --no-lighthouse)
            LIGHTHOUSE=false
            shift
            ;;
        --no-bundle)
            BUNDLE_ANALYZE=false
            shift
            ;;
        --no-tests)
            PERFORMANCE_TESTS=false
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}🚀 Starting Performance Analysis for Stefa.books${NC}"
echo -e "${BLUE}📍 Target: $HOST:$PORT${NC}"
echo -e "${BLUE}📁 Output: $OUTPUT_DIR${NC}"
echo ""

# Check if Next.js app is running
check_app_running() {
    echo -e "${YELLOW}🔍 Checking if Next.js app is running...${NC}"
    
    if curl -s "$HOST:$PORT" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ App is running on $HOST:$PORT${NC}"
    else
        echo -e "${RED}❌ App is not running on $HOST:$PORT${NC}"
        echo -e "${YELLOW}💡 Please start the app with: pnpm dev${NC}"
        exit 1
    fi
}

# Run Lighthouse analysis
run_lighthouse() {
    if [ "$LIGHTHOUSE" = true ]; then
        echo -e "${YELLOW}🔍 Running Lighthouse analysis...${NC}"
        
        if command -v lighthouse > /dev/null 2>&1; then
            lighthouse "$HOST:$PORT" \
                --output html \
                --output-path "$OUTPUT_DIR/lighthouse-report.html" \
                --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
                --only-categories=performance,accessibility,best-practices,seo
            
            echo -e "${GREEN}✅ Lighthouse report saved to $OUTPUT_DIR/lighthouse-report.html${NC}"
        else
            echo -e "${YELLOW}⚠️  Lighthouse not installed. Installing...${NC}"
            npm install -g lighthouse
            run_lighthouse
        fi
    fi
}

# Run bundle analysis
run_bundle_analyze() {
    if [ "$BUNDLE_ANALYZE" = true ]; then
        echo -e "${YELLOW}📦 Running bundle analysis...${NC}"
        
        if [ -f "package.json" ]; then
            echo -e "${YELLOW}🔧 Building with bundle analyzer...${NC}"
            
            # Check if @next/bundle-analyzer is installed
            if ! grep -q "@next/bundle-analyzer" package.json; then
                echo -e "${YELLOW}📦 Installing @next/bundle-analyzer...${NC}"
                pnpm add -D @next/bundle-analyzer
            fi
            
            # Run build with analyzer
            ANALYZE=true pnpm build
            
            echo -e "${GREEN}✅ Bundle analysis completed${NC}"
        else
            echo -e "${RED}❌ package.json not found${NC}"
        fi
    fi
}

# Run performance tests
run_performance_tests() {
    if [ "$PERFORMANCE_TESTS" = true ]; then
        echo -e "${YELLOW}🧪 Running performance tests...${NC}"
        
        if [ -f "package.json" ] && grep -q "test:performance" package.json; then
            echo -e "${YELLOW}🔧 Running performance tests...${NC}"
            pnpm test:performance
        else
            echo -e "${YELLOW}⚠️  Performance tests not configured${NC}"
            echo -e "${BLUE}💡 Add test:performance script to package.json${NC}"
        fi
    fi
}

# Generate performance summary
generate_summary() {
    echo -e "${YELLOW}📊 Generating performance summary...${NC}"
    
    cat > "$OUTPUT_DIR/performance-summary.md" << EOF
# Performance Analysis Summary

**Generated:** $(date)
**Target:** $HOST:$PORT
**Output Directory:** $OUTPUT_DIR

## Reports Generated

EOF

    if [ "$LIGHTHOUSE" = true ]; then
        echo "- Lighthouse: [lighthouse-report.html](./lighthouse-report.html)" >> "$OUTPUT_DIR/performance-summary.md"
    fi
    
    if [ "$BUNDLE_ANALYZE" = true ]; then
        echo "- Bundle Analysis: Check console output for bundle analyzer" >> "$OUTPUT_DIR/performance-summary.md"
    fi
    
    if [ "$PERFORMANCE_TESTS" = true ]; then
        echo "- Performance Tests: Check test output above" >> "$OUTPUT_DIR/performance-summary.md"
    fi

    echo "" >> "$OUTPUT_DIR/performance-summary.md"
    echo "## Next Steps" >> "$OUTPUT_DIR/performance-summary.md"
    echo "1. Review Lighthouse report for performance issues" >> "$OUTPUT_DIR/performance-summary.md"
    echo "2. Analyze bundle size and optimize imports" >> "$OUTPUT_DIR/performance-summary.md"
    echo "3. Run performance tests regularly" >> "$OUTPUT_DIR/performance-summary.md"
    echo "4. Monitor Core Web Vitals in production" >> "$OUTPUT_DIR/performance-summary.md"

    echo -e "${GREEN}✅ Performance summary saved to $OUTPUT_DIR/performance-summary.md${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🎯 Starting performance analysis...${NC}"
    
    check_app_running
    run_lighthouse
    run_bundle_analyze
    run_performance_tests
    generate_summary
    
    echo ""
    echo -e "${GREEN}🎉 Performance analysis completed!${NC}"
    echo -e "${BLUE}📁 Check results in: $OUTPUT_DIR${NC}"
    echo ""
    echo -e "${YELLOW}💡 Tips for improving performance:${NC}"
    echo "  - Optimize images and use WebP format"
    echo "  - Implement code splitting and lazy loading"
    echo "  - Use CDN for static assets"
    echo "  - Monitor Core Web Vitals"
    echo "  - Implement caching strategies"
}

# Run main function
main "$@"
