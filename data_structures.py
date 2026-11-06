"""
Məlumat Strukturları və Alqoritmlər (DSA) Modulu.
Bu fayl sorğu məlumatlarını emal etmək üçün tələb olunan əsas məlumat strukturlarını
sıfırdan (heç bir hazır kitabxanadan istifadə etmədən) reallaşdırır:
1. Singly Linked List (Təktərəfli əlaqəli siyahı)
2. Doubly Linked List (İkitərəfli əlaqəli siyahı)
3. Hash Table (Həş cədvəli - toqquşmaların zəncirlənmə üsulu ilə həlli)
4. Binary Search Tree / BST (İkili axtarış ağacı)
"""

import csv
from pathlib import Path


# ============================================================================
# 1. SINGLY LINKED LIST (Təktərəfli əlaqəli siyahı)
# İstifadə sahəsi: Sorğunun suallarının və filtr tarixçəsinin ardıcıl saxlanması
# ============================================================================

class Node:
    """Təktərəfli əlaqəli siyahının qovşağı."""
    def __init__(self, data):
        self.data = data
        self.next = None

    def __repr__(self):
        return f"Node({self.data})"


class SinglyLinkedList:
    """Təktərəfli əlaqəli siyahı (Singly Linked List)."""
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def append(self, data):
        """Siyahının sonuna element əlavə edir - O(1)"""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node
        self.size += 1

    def prepend(self, data):
        """Siyahının əvvəlinə element əlavə edir - O(1)"""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            new_node.next = self.head
            self.head = new_node
        self.size += 1

    def to_list(self):
        """Siyahını adi Python massivinə çevirir - O(n)"""
        result = []
        current = self.head
        while current:
            result.append(current.data)
            current = current.next
        return result

    def search(self, target):
        """Elementi axtarır - O(n)"""
        current = self.head
        index = 0
        while current:
            if current.data == target:
                return index
            current = current.next
            index += 1
        return -1

    def __len__(self):
        return self.size

    def __iter__(self):
        current = self.head
        while current:
            yield current.data
            current = current.next


# ============================================================================
# 2. DOUBLY LINKED LIST (İkitərəfli əlaqəli siyahı)
# İstifadə sahəsi: Respondentlər arasında iki istiqamətli naviqasiya (İrəli / Geri)
# ============================================================================

class DNode:
    """İkitərəfli əlaqəli siyahının qovşağı."""
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None

    def __repr__(self):
        return f"DNode({self.data})"


class DoublyLinkedList:
    """İkitərəfli əlaqəli siyahı (Doubly Linked List)."""
    def __init__(self):
        self.head = None
        self.tail = None
        self.current = None  # Cari baxılan respondent (naviqator üçün)
        self.size = 0

    def append(self, data):
        """Siyahının sonuna element əlavə edir - O(1)"""
        new_node = DNode(data)
        if not self.head:
            self.head = new_node
            self.tail = new_node
            self.current = new_node
        else:
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node
        self.size += 1

    def next_element(self):
        """Növbəti elementə keçir - O(1)"""
        if self.current and self.current.next:
            self.current = self.current.next
            return self.current.data
        return None

    def prev_element(self):
        """Əvvəlki elementə qayıdır - O(1)"""
        if self.current and self.current.prev:
            self.current = self.current.prev
            return self.current.data
        return None

    def get_current(self):
        """Hazırda seçilmiş elementi qaytarır"""
        return self.current.data if self.current else None

    def to_list_forward(self):
        """Başdan sona qədər siyahı - O(n)"""
        res = []
        curr = self.head
        while curr:
            res.append(curr.data)
            curr = curr.next
        return res

    def to_list_backward(self):
        """Sondan başa qədər əks istiqamətli siyahı - O(n)"""
        res = []
        curr = self.tail
        while curr:
            res.append(curr.data)
            curr = curr.prev
        return res

    def __len__(self):
        return self.size


# ============================================================================
# 3. HASH TABLE (Həş Cədvəli)
# İstifadə sahəsi: Respondentlərin ID üzrə ani axtarışı (O(1) orta mürəkkəblik)
# Toqquşmalar Separate Chaining (Zəncirləmə) metodu ilə idarə olunur.
# ============================================================================

class HashEntry:
    """Həş cədvəlinin daxili açar-dəyər qovşağı."""
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None


class HashTable:
    """Açar-dəyər saxlayan və toqquşmaları zəncirləyən Həş Cədvəli."""
    def __init__(self, capacity=64):
        self.capacity = capacity
        self.buckets = [None] * capacity
        self.size = 0

    def _hash(self, key):
        """Həş funksiyası: String açarı cədvəl indeksinə çevirir (Polinomial həş)"""
        hash_code = 0
        key_str = str(key)
        for char in key_str:
            hash_code = (hash_code * 31 + ord(char)) % self.capacity
        return hash_code

    def put(self, key, value):
        """Açar və dəyəri əlavə edir və ya yeniləyir - O(1) orta mürəkkəblik"""
        index = self._hash(key)
        head = self.buckets[index]

        # Əgər açar artıq varsa, dəyəri yenilə
        current = head
        while current:
            if current.key == key:
                current.value = value
                return
            current = current.next

        # Yeni element zəncirin əvvəlinə əlavə olunur (Chaining)
        new_entry = HashEntry(key, value)
        new_entry.next = head
        self.buckets[index] = new_entry
        self.size += 1

        # Əgər yük faktoru (load factor) 0.75-dən çoxdursa, cədvəli böyüt (Rehash)
        if self.size / self.capacity > 0.75:
            self._rehash()

    def get(self, key):
        """Açara uyğun dəyəri tapır - O(1) orta mürəkkəblik"""
        index = self._hash(key)
        current = self.buckets[index]
        while current:
            if current.key == key:
                return current.value
            current = current.next
        return None

    def contains(self, key):
        """Açarın mövcudluğunu yoxlayır"""
        return self.get(key) is not None

    def remove(self, key):
        """Açara uyğun elementi silir"""
        index = self._hash(key)
        current = self.buckets[index]
        prev = None
        while current:
            if current.key == key:
                if prev:
                    prev.next = current.next
                else:
                    self.buckets[index] = current.next
                self.size -= 1
                return True
            prev = current
            current = current.next
        return False

    def _rehash(self):
        """Cədvəlin ölçüsünü 2 dəfə artırır və elementləri yenidən yerləşdirir"""
        old_buckets = self.buckets
        self.capacity *= 2
        self.buckets = [None] * self.capacity
        self.size = 0
        for head in old_buckets:
            current = head
            while current:
                self.put(current.key, current.value)
                current = current.next

    def __len__(self):
        return self.size


# ============================================================================
# 4. BINARY SEARCH TREE (İkili Axtarış Ağacı - BST)
# İstifadə sahəsi: Respondentləri etibar balına (və ya yaşa) görə sıralamaq
# və verilmiş aralıqdakı respondentləri O(h) vaxtda tapmaq.
# ============================================================================

class BSTNode:
    """BST-nin qovşağı. Eyni balı alan bir neçə respondent siyahı kimi saxlanır."""
    def __init__(self, key, respondent):
        self.key = key  # Məsələn etibar balı: 1.0, 2.0, 3.0, 4.0, 5.0
        self.respondents = [respondent]  # Həmin bala aid respondentlər
        self.left = None
        self.right = None


class BinarySearchTree:
    """İkili Axtarış Ağacı (BST)."""
    def __init__(self):
        self.root = None
        self.total_nodes = 0

    def insert(self, key, respondent):
        """Ağaca yeni respondent əlavə edir - O(log n) orta mürəkkəblik"""
        if self.root is None:
            self.root = BSTNode(key, respondent)
            self.total_nodes += 1
        else:
            self._insert_recursive(self.root, key, respondent)

    def _insert_recursive(self, current, key, respondent):
        if key == current.key:
            current.respondents.append(respondent)
        elif key < current.key:
            if current.left is None:
                current.left = BSTNode(key, respondent)
                self.total_nodes += 1
            else:
                self._insert_recursive(current.left, key, respondent)
        else:
            if current.right is None:
                current.right = BSTNode(key, respondent)
                self.total_nodes += 1
            else:
                self._insert_recursive(current.right, key, respondent)

    def search(self, key):
        """Verilmiş bala bərabər olan bütün respondentləri tapır"""
        return self._search_recursive(self.root, key)

    def _search_recursive(self, current, key):
        if current is None:
            return []
        if key == current.key:
            return current.respondents
        if key < current.key:
            return self._search_recursive(current.left, key)
        return self._search_recursive(current.right, key)

    def inorder(self):
        """Ağacı kiçikdən böyüyə doğru sıralı gəzir (Inorder traversal)"""
        result = []
        self._inorder_recursive(self.root, result)
        return result

    def _inorder_recursive(self, current, result):
        if current:
            self._inorder_recursive(current.left, result)
            result.append((current.key, len(current.respondents)))
            self._inorder_recursive(current.right, result)

    def find_range(self, min_key, max_key):
        """Verilmiş intervaldakı (min <= key <= max) bütün respondentləri qaytarır"""
        result = []
        self._find_range_recursive(self.root, min_key, max_key, result)
        return result

    def _find_range_recursive(self, current, min_key, max_key, result):
        if current is None:
            return
        # Sol tərəfə bax
        if current.key > min_key:
            self._find_range_recursive(current.left, min_key, max_key, result)
        # Cari qovşaq intervala düşürsə əlavə et
        if min_key <= current.key <= max_key:
            result.extend(current.respondents)
        # Sağ tərəfə bax
        if current.key < max_key:
            self._find_range_recursive(current.right, min_key, max_key, result)


# ============================================================================
# REAL MƏLUMATIN (data.csv) STRUKTURLARA DOLDURULMASI
# ============================================================================

def load_survey_dsa(csv_path="data.csv"):
    """
    data.csv faylını oxuyur və bütün 4 məlumat strukturuna paylayır.
    """
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"{csv_path} tapılmadı.")

    questions_list = SinglyLinkedList()
    respondents_dll = DoublyLinkedList()
    respondents_hash = HashTable(capacity=128)
    trust_bst = BinarySearchTree()

    with open(path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []

        # 1. Singly Linked List-ə sualların siyahısını doldururuq
        for h in headers:
            questions_list.append(h.strip())

        # 2, 3, 4. Digər strukturlara respondentləri doldururuq
        resp_id_counter = 1
        for raw_row in reader:
            row = {k.strip(): (v.strip() if v else "") for k, v in raw_row.items() if k}
            resp_id = f"RESP-{resp_id_counter:03d}"
            respondent = {
                "id": resp_id,
                "yas": row.get("Yaşınız?", ""),
                "cins": row.get("Cinsiniz?", ""),
                "mesguliyyet": row.get("Məşğuliyyətiniz?", ""),
                "sahe": row.get("Sahəniz (və ya oxuduğunuz ixtisas)?", ""),
                "ai_istifade": row.get("AI alətlərindən istifadə edirsiniz?", ""),
                "aletler": row.get("Hansı alətlərdən istifadə edirsiniz?", ""),
                "etibar_raw": row.get("AI cavablarına nə qədər etibar edirsiniz?", ""),
            }

            # 2. Doubly Linked List-ə əlavə et (Naviqasiya üçün)
            respondents_dll.append(respondent)

            # 3. Hash Table-a əlavə et (ID üzrə O(1) axtarış üçün)
            respondents_hash.put(resp_id, respondent)

            # 4. BST-yə etibar balına görə əlavə et (Ağac strukturu üçün)
            raw_trust = respondent["etibar_raw"]
            try:
                trust_val = float(raw_trust)
                if 1.0 <= trust_val <= 5.0:
                    trust_bst.insert(trust_val, respondent)
            except (ValueError, TypeError):
                pass  # Boş və ya qeyri-rəqəm cavabları burax

            resp_id_counter += 1

    return {
        "questions_list": questions_list,
        "respondents_dll": respondents_dll,
        "respondents_hash": respondents_hash,
        "trust_bst": trust_bst,
    }


# ============================================================================
# KONSOLDA NÜMAYİŞ / TEST FUNKSİYASI
# ============================================================================

def demo():
    print("=" * 65)
    print("  MƏLUMAT STRUKTURLARI VƏ ALQORİTMLƏR — SORĞU ANALİZİ")
    print("=" * 65)

    data = load_survey_dsa("data.csv")

    q_list = data["questions_list"]
    dll = data["respondents_dll"]
    ht = data["respondents_hash"]
    bst = data["trust_bst"]

    # 1. Singly Linked List Nümayişi
    print("\n[1] SINGLY LINKED LIST (Təktərəfli əlaqəli siyahı):")
    print(f"  • Toplam sual sayı: {len(q_list)}")
    print("  • İlk 3 sual zənciri:")
    curr = q_list.head
    for i in range(3):
        if curr:
            print(f"    [{i+1}] {curr.data}")
            curr = curr.next

    # 2. Doubly Linked List Nümayişi
    print("\n[2] DOUBLY LINKED LIST (İkitərəfli əlaqəli siyahı - Naviqasiya):")
    print(f"  • Cəmi respondent sayı: {len(dll)}")
    first = dll.get_current()
    print(f"  • Hazırkı respondent: {first['id']} ({first['yas']}, {first['mesguliyyet']})")
    nxt = dll.next_element()
    print(f"  • next_element() -> İrəli keçid: {nxt['id']} ({nxt['yas']}, {nxt['mesguliyyet']})")
    prv = dll.prev_element()
    print(f"  • prev_element() -> Geri qayıdış: {prv['id']} ({prv['yas']})")

    # 3. Hash Table Nümayişi
    print("\n[3] HASH TABLE (Həş Cədvəli - O(1) ani axtarış):")
    target_id = "RESP-042"
    found = ht.get(target_id)
    print(f"  • Cədvəldə qeyd sayı: {len(ht)}")
    if found:
        print(f"  • ht.get('{target_id}') tapıldı:")
        print(f"    - Yaş: {found['yas']}, Məşğuliyyət: {found['mesguliyyet']}")
        print(f"    - AI Alətləri: {found['aletler']}")
    print(f"  • 'RESP-999' axtarışı (yoxdur): {ht.contains('RESP-999')}")

    # 4. Binary Search Tree (BST) Nümayişi
    print("\n[4] BINARY SEARCH TREE (İkili Axtarış Ağacı):")
    print("  • Etibar balına görə Inorder sıralama (Bal, Respondent sayı):")
    for score, count in bst.inorder():
        print(f"    - {score} bal verənlər: {count} respondent")

    high_trust = bst.find_range(4.0, 5.0)
    print(f"  • find_range(4.0, 5.0) -> Yüksək etibar bəsləyənlər: {len(high_trust)} nəfər")

    print("\n" + "=" * 65)
    print("  Bütün 4 məlumat strukturu uğurla test edildi!")
    print("=" * 65)


if __name__ == "__main__":
    demo()
