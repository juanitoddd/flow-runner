import time
a = {'normal': 1, 'deep': {'some': 2}}
b = ['one', 'two', 'three']
print(a)
time.sleep(3)
print(b)
def main(a, b):
  print("Adding ...")
  time.sleep(3)
  return a + b