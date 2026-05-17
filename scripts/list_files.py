import os
import sys
p = sys.argv[1]
for fn in sorted(os.listdir(p)):
    print(repr(fn))
