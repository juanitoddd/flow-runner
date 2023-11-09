import time
a = {'normal': 1, 'deep': {'some': 2}}
b = ['one', 'two', 'three']

# @info Add two numbers and returns the result
def main(a:int, b:int) -> int:
  print("Adding ...")
  print(a)
  print(b)
  time.sleep(3)
  c = a + b
  return c