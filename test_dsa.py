import unittest
from data_structures import SinglyLinkedList, DoublyLinkedList, HashTable, BinarySearchTree, load_survey_dsa


class TestDataStructures(unittest.TestCase):
    def test_singly_linked_list(self):
        sll = SinglyLinkedList()
        sll.append("A")
        sll.append("B")
        sll.prepend("Start")
        self.assertEqual(len(sll), 3)
        self.assertEqual(sll.to_list(), ["Start", "A", "B"])
        self.assertEqual(sll.search("A"), 1)
        self.assertEqual(sll.search("X"), -1)

    def test_doubly_linked_list(self):
        dll = DoublyLinkedList()
        dll.append("R1")
        dll.append("R2")
        dll.append("R3")
        self.assertEqual(len(dll), 3)
        self.assertEqual(dll.get_current(), "R1")
        self.assertEqual(dll.next_element(), "R2")
        self.assertEqual(dll.next_element(), "R3")
        self.assertIsNone(dll.next_element())
        self.assertEqual(dll.prev_element(), "R2")
        self.assertEqual(dll.to_list_forward(), ["R1", "R2", "R3"])
        self.assertEqual(dll.to_list_backward(), ["R3", "R2", "R1"])

    def test_hash_table(self):
        ht = HashTable(capacity=8)
        for i in range(20):
            ht.put(f"key-{i}", f"val-{i}")
        self.assertEqual(len(ht), 20)
        self.assertEqual(ht.get("key-5"), "val-5")
        self.assertTrue(ht.contains("key-19"))
        self.assertFalse(ht.contains("key-999"))
        self.assertTrue(ht.remove("key-5"))
        self.assertFalse(ht.contains("key-5"))
        self.assertEqual(len(ht), 19)

    def test_binary_search_tree(self):
        bst = BinarySearchTree()
        bst.insert(3.0, "p1")
        bst.insert(1.0, "p2")
        bst.insert(5.0, "p3")
        bst.insert(4.0, "p4")
        bst.insert(4.0, "p5")

        inorder_keys = [k for k, _ in bst.inorder()]
        self.assertEqual(inorder_keys, [1.0, 3.0, 4.0, 5.0])
        self.assertEqual(len(bst.search(4.0)), 2)
        
        range_items = bst.find_range(3.0, 5.0)
        self.assertEqual(len(range_items), 4)  # 3.0, 4.0 (x2), 5.0

    def test_real_survey_data(self):
        dsa = load_survey_dsa("data.csv")
        self.assertEqual(len(dsa["respondents_dll"]), 126)
        self.assertEqual(len(dsa["respondents_hash"]), 126)
        # Trust answers total: 108
        total_in_bst = sum(count for _, count in dsa["trust_bst"].inorder())
        self.assertEqual(total_in_bst, 108)


if __name__ == "__main__":
    unittest.main()

