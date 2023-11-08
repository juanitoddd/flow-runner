import time
a = {'normal': 1, 'deep': {'some': 2}}
b = ['one', 'two', 'three']
def main(a, b):
  print("Adding ...")
  print(a)
  print(b)
  time.sleep(3)
  c = a + b
  return c