import difflib

query_str = '你好'
s1 = '你，'
s2 = '你你好'
s3 = '你'

print(difflib.SequenceMatcher(None, query_str, s1).quick_ratio())  
print(difflib.SequenceMatcher(None, query_str, s2).quick_ratio())  
print(difflib.SequenceMatcher(None, query_str, s3).quick_ratio()) 